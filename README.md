########################### Expense Tracker ##################################

Expense Tracker application that helps you manage budgets, track expenses, and monitor financial progress. This project is built using Angular for the frontend, ASP.NET Core for the backend, and integrates ApexCharts for dynamic charting.

####### Features #######
- Authentication: Secure user login using JWT tokens.
- Add Budget for Each Month: Easily set up budgets for the current or upcoming months.
- Increment Monthly Limit: Adjust your budget limits dynamically based on your requirements.
- Track Expenses: Categorize and manage your spending across multiple categories.
- Visualize Financial Data: Interactive charts to monitor monthly budget progress and spending by category.
- Notifications: Alerts for when you're close to or exceeding your monthly limit.
- Category Management: Add categories for better expense organization.


####### Technologies Used #######

Frontend : 
    Angular 18
Backend : 
    .Net 8
DataBase : 
    Mysql



################ Clone this repository:
    git clone https://github.com/fayssalpi/Expense-Tracker.git

################ Steps to Setup the Frontend : 

Install dependencies:
    npm install

Start the Angular development server
    ng serve

################ Steps to Setup the Backend

Restore dependencies:
    dotnet restore

Update your database connection string in appsettings.json:
    "ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=ExpenseTrackerDB;Trusted_Connection=True;"
    }

Apply migrations to set up the database:
    dotnet ef database update

Run the backend:
    dotnet run








