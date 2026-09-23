"""
Canonical factory_boy factories.

Place in apps/<feature>/tests/factories.py. One factory per model.

Patterns demonstrated:
- DjangoModelFactory base class
- factory.Sequence for monotonic uniqueness
- factory.Faker for realistic dummy data
- SubFactory for FK relations
- post_generation for M2M / reverse-FK relations
- LazyAttribute for derived values
- django_get_or_create for idempotent factory calls
"""
from __future__ import annotations

import factory
from factory.django import DjangoModelFactory

# Replace with your actual model imports
from apps.users.models import User
from apps.products.models import Product
from apps.orders.models import Order, OrderItem


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("email",)  # idempotent — re-running with same email returns existing

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    name = factory.Faker("name")
    is_active = True


class ProductFactory(DjangoModelFactory):
    class Meta:
        model = Product
        django_get_or_create = ("sku",)

    sku = factory.Sequence(lambda n: f"SKU-{n:06d}")
    name = factory.Faker("catch_phrase")
    price = factory.Faker("pydecimal", left_digits=3, right_digits=2, positive=True)
    is_active = True


class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order

    user = factory.SubFactory(UserFactory)
    status = "pending"
    shipping_address = factory.Faker("address")

    @factory.post_generation
    def items(self, create, extracted, **kwargs):
        """Create N OrderItem rows after the Order is saved.

        Usage:
            OrderFactory()                   # creates 2 items (default)
            OrderFactory(items=5)            # creates 5 items
            OrderFactory(items=0)            # creates an order with no items
            OrderFactory(items__product=...) # forwarding to OrderItemFactory
        """
        if not create:
            return
        if extracted is None:
            count = 2
        else:
            count = int(extracted)
        for _ in range(count):
            OrderItemFactory(order=self, **kwargs)


class OrderItemFactory(DjangoModelFactory):
    class Meta:
        model = OrderItem

    order = factory.SubFactory(OrderFactory)
    product = factory.SubFactory(ProductFactory)
    quantity = factory.Faker("random_int", min=1, max=10)
    unit_price = factory.LazyAttribute(lambda obj: obj.product.price)
