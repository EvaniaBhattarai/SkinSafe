# SkinSense

Find skincare products suited for sensitive skin, explore community reviews, and discover products that are better suited to your skin. Join a community of people with similar skin concerns and make more informed skincare choices.

## 💡 About the Project

SkinSense was inspired by my own experience struggling to find skincare products that were safe and compatible with my skin. Dealing with atopic dermatitis, severe eczema, and fragrance allergies made it especially difficult to identify products that would work for me. Existing product-checking platforms often had outdated or inconsistent information, or simply did not have enough products in their databases to provide useful recommendations.

I developed **SkinSense** to create a more comprehensive and community-driven solution. The platform allows users to discover skincare products while filtering based on factors that matter to them, including **allergens, budget, and preferred brands**. Users can also connect with a community of people who share similar skin concerns, making it easier to exchange experiences and discover products that may work for them.

Rather than relying solely on a static product database, SkinSense is designed around the idea that **real user experiences can help make product discovery more personalized and useful**.

## ✨ Key Features

* 🔍 Search and browse skincare products
* 🧴 Explore product ingredients and potential skin irritants
* ⚠️ Identify products containing potential allergens or irritants
* 💰 Filter products by budget range
* 🏷️ Filter by preferred brands
* ⭐ Explore community product reviews and experiences
* 👥 Connect with users with similar skin concerns
* 👤 Create an account and manage user profiles
* 🗄️ Manage product and user data through a connected database

## 🛠️ Technologies

### Frontend

* React 18
* React Router
* JavaScript / JSX
* Babel
* HTML5
* CSS3
* AJAX

### Backend

* Java
* Spring Boot
* RESTful APIs
* Spring REST Controllers
* Java Servlet API
* HTTP Sessions

### Database & Data Management

* Database connectivity
* JSON
* Jackson ObjectMapper
* CRUD operations
* Structured model, view, and database utility architecture

## 🏗️ Technical Architecture

SkinSense uses a **full-stack architecture** connecting a React frontend with a Java Spring Boot backend. The frontend uses reusable React components and React Router to manage navigation and dynamically render application content.

The backend exposes RESTful endpoints for interacting with product and user data. Product functionality includes retrieving, inserting, updating, and deleting records, while user functionality includes registration, login, profile management, and logout. The application uses HTTP sessions to maintain authenticated users and Jackson's `ObjectMapper` to convert JSON data between the frontend and backend.

This architecture allows the application to separate the **user interface, API layer, and database operations**, creating a modular foundation that can be expanded with additional product data and community features.
