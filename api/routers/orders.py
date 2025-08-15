from fastapi import APIRouter, HTTPException
from api.models.order import Order, OrderCreate, OrderResponse
from api.models.order_item import OrderItem, OrderItemCreate
from api.utils.supabase import supabase
import uuid
from datetime import datetime, timezone

def parse_date(date_str):
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except ValueError:
        raise ValueError(f"Invalid date format: {date_str}")

def calculate_sales_summary(orders):
    now = datetime.now(timezone.utc)

    today_total = 0
    monthly_total = 0
    yearly_total = 0

    for order in orders:
        order_date = parse_date(order.created_at)

        # Today
        if order_date.date() == now.date():
            today_total += order.total_price

        # This month
        if order_date.year == now.year and order_date.month == now.month:
            monthly_total += order.total_price

        # This year
        if order_date.year == now.year:
            yearly_total += order.total_price

    return {
        "today_sales": today_total,
        "monthly_sales": monthly_total,
        "yearly_sales": yearly_total
    }


router = APIRouter(prefix="/orders")

@router.post("/", response_model=Order)
def create_order(order: OrderResponse):
    order_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()

    order_details = {
        "order_id": order_id,
        "user_id": order.user_id,
        "store_id": order.store_id,
        "pickup_time": order.pickup_time,
        "total_price": order.total_price,
        "ticket_url": order.ticket_url,
        "receipt_url": order.receipt_url,
        "created_at": timestamp,
        "status": "Received"
    }

    try:
        supabase.table("Orders").insert(order_details).execute()
        for item in order.items_list:
            item_data = item.dict()
            item_data["order_item_id"] = str(uuid.uuid4())
            item_data["order_id"] = order_id
            item_data["store_id"] = order.store_id
            item_data["user_id"] = order.user_id
            item_data["created_at"] = timestamp
            supabase.table("OrderItems").insert(item_data).execute()
        # Fetch inserted order items as OrderItem objects
        items_result = supabase.table("OrderItems").select("*").eq("order_id", order_id).execute()
        items_list = [OrderItem(**item) for item in items_result.data]
        return OrderResponse(**order_details, items_list=items_list)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


'''
Recommendation: If frontend needs items, either join in backend or document that frontend should call /orders/{order_id}/items.
'''

#to get all orders for the vendor
@router.get("/store/{store_id}", response_model=list[Order])
def get_orders_for_store(store_id: str):
    result = supabase.table("Orders").select("*").eq("store_id", store_id).execute()
    return result.data

#to get all orders for a user
@router.get("/", response_model=list[Order])
def get_orders(user_id: str):
    result = supabase.table("Orders").select("*").eq("user_id", user_id).eq("status", "received").execute()
    orders = [Order(**order) for order in result.data]
    return orders
    
#to get order items by order_id
@router.get("/{order_id}/details", response_model=OrderResponse)
def get_order_details(order_id: str):
    # Fetch order
    order_data = supabase.table("Orders").select("*").eq("order_id", order_id).execute().data
    if not order_data:
        raise HTTPException(status_code=404, detail="Order not found")
    order = order_data[0]

    # Fetch user
    user_data = supabase.table("Users").select("username,email").eq("user_id", order["user_id"]).execute().data
    user_info = user_data[0] if user_data else {}

    # Fetch store
    store_data = supabase.table("Stores").select("store_name").eq("store_id", order["store_id"]).execute().data
    store_info = store_data[0] if store_data else {}

    # Fetch order items
    items_data = supabase.table("OrderItems").select("*").eq("order_id", order_id).execute().data
    items = [OrderItem(**item) for item in items_data]

    # Combine info
    response = OrderResponse(
        **order,
        items_list=items,
        # Optionally add user/store info to response or as extra fields
    )
    return response

# Endpoint to update order status
@router.patch("/{order_id}/status")
def update_order_status(order_id: str, status: str):
    valid_statuses = ["received", "processing", "for_pickup", "complete", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    supabase.table("Orders").update({"status": status}).eq("order_id", order_id).execute()
    return {"order_id": order_id, "status": status}

#for uploading attachments like pdf, photos, etc.
@router.post("/orders/{order_id}/upload")
def upload_order_receipt(order_id: str, receipt_url: str):
    return supabase.table("Orders").update({"receipt_url": receipt_url}).eq("order_id", order_id).execute()


#for reports
@router.get("/reports/{store_id}", response_model=ReportResponse)
def get_sales_report(store_id: UUID):
    try:
        # Fetch orders from Supabase for this store
        result = supabase.table("Orders") \
            .select("*") \
            .eq("store_id", str(store_id)) \
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="No orders found for this store")

        now = datetime.now(timezone.utc)
        today_total = 0
        month_total = 0
        year_total = 0
        total_orders = len(result.data)
        total_revenue = 0

        for order in result.data:
            created_at = datetime.fromisoformat(order["created_at"].replace("Z", "+00:00"))
            price = float(order["total_price"])
            total_revenue += price

            # Today
            if created_at.date() == now.date():
                today_total += price

            # This month
            if created_at.year == now.year and created_at.month == now.month:
                month_total += price

            # This year
            if created_at.year == now.year:
                year_total += price

        return ReportResponse(
            store_id=store_id,
            total_orders=total_orders,
            total_revenue=total_revenue,
            sales_summary=SalesSummary(
                today_sales=today_total,
                monthly_sales=month_total,
                yearly_sales=year_total
            )
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))