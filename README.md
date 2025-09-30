# 🐙 Octomart - AI-Powered Microservices E-commerce Platform



**Octomart** is a modern, AI-driven, multi-vendor e-commerce platform built with the MERN stack. Architected with 8 independent microservices, it's designed for high performance, scalability, and easy maintenance. The platform leverages a dedicated AI service to create a smart and personalized shopping experience for every user.

---

## 🚀 Key Features

### Core E-commerce Features
-   **Multi-Vendor System**: A dedicated **Seller Service** allows third-party sellers to register, manage their profiles, and list products.
-   **User & Seller Authentication**: Secure, role-based authentication for both customers and sellers using JSON Web Tokens (JWT).
-   **Comprehensive Product Catalog**: System for managing products, categories, and inventory across all vendors.
-   **Dynamic Shopping Cart**: Persistent shopping cart functionality for a seamless user experience.
-   **Full Order Management**: Complete order lifecycle from placement and payment to shipping and delivery.
-   **Secure Payment Integration**: Securely process transactions through providers like Stripe or PayPal.


---

## 🛠️ Tech Stack & Architecture

This project is built on a robust and modern tech stack, designed for scalability and independent development.

-   **Frontend**: React, Redux for state management, Tailwind CSS for styling.
-   **Backend**: Node.js & Express.js for building RESTful APIs.
-   **Database**: MongoDB with Mongoose for flexible data modeling.
-   **Architecture**: Microservices connected via an API Gateway.
-   **Containerization**: Docker & Docker Compose for easy setup and deployment.

---

## 📦 Microservices Overview

The platform is decoupled into 8 independent services, each responsible for a specific business domain.

1.  **Auth Service**: Manages user and seller registration, login, and JSON Web Token (JWT) generation.
2.  **Product Service**: Handles the complete product catalog, including inventory, categories, and seller-specific listings.
3.  **Cart Service**: Responsible for all shopping cart operations, such as adding, updating, and removing items for a user's session.
4.  **Order Service**: Manages the entire order lifecycle, from creation and processing to tracking and fulfillment.
5.  **Notification Service**: Sends transactional emails, SMS, and other alerts for events like order confirmations and shipping updates.
6.  **AI Service**: Powers all machine learning features, including intelligent search, personalized recommendations, and sentiment analysis.
7.  **Payment Service**: Integrates securely with third-party payment gateways (e.g., Stripe, PayPal) to handle all transactions.
8.  **Seller Service**: Manages seller accounts, dashboards, product management, and payout information for the multi-vendor marketplace.
