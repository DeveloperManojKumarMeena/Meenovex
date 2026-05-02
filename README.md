# 🚀 Meenovex — Scalable MERN E-Commerce Platform with AI

Meenovex is a modern full-stack MERN e-commerce platform built using a **microservices architecture**. It is designed to be scalable, modular, and AI-powered, with multiple independent services communicating through RabbitMQ.

---

## 🧩 Architecture

- Microservices-based backend
- Event-driven communication using RabbitMQ
- Scalable and loosely coupled services
- Frontend: Coming Soon

---

## ⚙️ Microservices

The backend consists of 8 independent services:

- auth-service  
- product-service  
- cart-service  
- order-service  
- payment-service  
- notification-service  
- seller-service  
- AI-Buddy-service  

Each service is independently scalable and handles a specific domain.

---

## 🔄 Communication

- Services communicate using **RabbitMQ**
- Enables asynchronous processing and scalability

---

## 🔐 Authentication & Security

- Three types of users:
  - Buyer
  - Seller
  - Admin

- OTP-based authentication:
  - Mobile and Email verification using Twilio

- Token-based authentication system
- Logout handled using token expiration with Redis (ioredis)

- Request validation using express-validator

---

## 💳 Payment Integration

- Razorpay integration for secure payments

---

## 🤖 AI Features

- AI-Buddy Service powered by **GenAI 2.0 Flash (LLM)**
- Automation workflows using **n8n**
- AI memory using **Pinecone vector database**

---

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB
- Redis (ioredis)
- RabbitMQ
- Razorpay
- Twilio
- express-validator

AI Stack:
- GenAI 2.0 Flash
- Pinecone
- n8n

---

## 📁 Project Structure
```js
meenovex/
│
├── services/
│ ├── auth-service/
│ ├── product-service/
│ ├── cart-service/
│ ├── order-service/
│ ├── payment-service/
│ ├── notification-service/
│ ├── seller-service/
│ └── AI-Buddy-service/
│
├── shared/
├── gateway/ (optional)
└── frontend/ (coming soon)
```
---

## 🚧 Status

- Backend: Completed
- Frontend: In Progress

---

## 🧠 Highlights

- Scalable microservices architecture
- Event-driven system using RabbitMQ
- AI-powered features
- OTP authentication system
- Secure payment integration
- Clean and modular structure

---

## 📌 Future Plans

- Frontend development (React)
- API Gateway implementation
- Advanced analytics
- Improved AI recommendations

---

## 🏷️ Project Name

Meenovex = Meena + Nova + Nexus  
Represents a next-generation intelligent commerce platform

---

## ⚡ Tagline

Smart Commerce, Powered by Intelligence
