# Amazon Project Function & Object Overview

The following diagram shows the key modules, functions, and data objects in the workspace. It can be updated whenever new components are added.

```mermaid
flowchart LR
    subgraph DataModule [data/cart.js]
        DO["deliveryOptions<br/>&lt;array&gt;"]
        GD[getDeliveryDate(days)]
        LCS[loadCartFromStorage()]
        SC[saveCart(cart)]
    end

    subgraph CheckoutScript [scripts/checkout.js]
        CC[createCartProductCard()]
        EL[body.addEventListener('change')]
        DEL[handleDeliveryOption(productId, optionId, date, priceCents)]
        HD[handleDelete(productId)]
        HU[handleUpdate(productId)]
    end

    DO -->|used by| CC
    GD -->|used by| CC
    LCS -->|used by| CC
    LCS -->|used by| DEL
    SC -->|used by| DEL

    CC -->|generates HTML with radios linked to| EL
    EL -->|calls when user selects| DEL
    CC -->|registers| EL

    CC -->|calls on delete click| HD
    CC -->|calls on update click| HU

    style DataModule fill:#f9f,stroke:#333,stroke-width:1px
    style CheckoutScript fill:#9f9,stroke:#333,stroke-width:1px
```

## Function List

- **loadCartFromStorage()** – read stored cart from `localStorage`.
- **saveCart(cart)** – save cart array to `localStorage`.
- **deliveryOptions** – array of delivery option objects used to render radio buttons.
- **getDeliveryDate(days)** – compute a human-readable date offset from today.
- **createCartProductCard()** – main renderer for the cart page; builds product cards and delivery radios.
- **handleDeliveryOption(productId, optionId, date, priceCents)** – update cart item when a radio is selected, persist change, and update the DOM.
- **handleDelete(productId)** – remove item from cart and re-render.
- **handleUpdate(productId)** – stub for quantity update logic.

> This file lives in the project root so that the diagram and descriptions are easy to find and maintain.
