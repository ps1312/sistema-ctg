# Sistema CTG - Animal Shelter Management System

A modern web application for managing animal shelters, built with React, TypeScript, and Convex. This system provides comprehensive tools for tracking animals, managing medical treatments, and monitoring medication schedules.

## 🔗 Live Demo

https://sistema-ctg.vercel.app/

## 🐾 Main Features

### Animal Management

- **Animal Registration**: Add new animals with complete profiles including name, sex, coat description, age, and owner information
- **Treatment Tracking**: Record treatment reasons and detailed treatment plans for each animal
- **Health Status Monitoring**: Track vaccination status (FIV, FELV, Rabies, V6) and health conditions
- **Animal Listing**: View all registered animals with search and filtering capabilities
- **Detailed Animal Profiles**: Access comprehensive animal information and medical history

### Medication Management

- **Medication Scheduling**: Schedule medications with specific dates, times, dosages, and observations
- **Daily Medication Dashboard**: View all medications scheduled for any given day
- **Treatment Administration**: Mark medications as administered with timestamp tracking
- **Medication History**: Track complete medication history for each animal
- **End-of-Treatment Indicators**: Automatically identify and highlight final doses of treatments
- **Time-based Organization**: Medications grouped by administration time with progress indicators

### Dashboard & Analytics

- **Real-time Statistics**:
  - Total number of animals in the system
  - Daily medication count
  - Number of administered medications
- **Date-filtered Views**: Navigate through different dates to view historical and future medication schedules
- **Status Indicators**: Visual indicators for pending, completed, and overdue medications
- **Collapsible Time Sections**: Automatically collapse past medication times to focus on current tasks

### User Interface

- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Intuitive Navigation**: Clear navigation between dashboard, animal list, and forms
- **Real-time Updates**: Live updates using Convex for immediate data synchronization
- **Toast Notifications**: User feedback for all actions and operations
- **Date Picker Integration**: Easy date selection for viewing medications and scheduling

## 🛠 Technology Stack

- **Frontend**: React 19 with TypeScript
- **Backend**: Convex (real-time database with built-in API)
- **Authentication**: Convex Auth
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design
- **Notifications**: Sonner for toast notifications
- **Development**: Vite for fast development and building

## 📋 Key Components

- **AnimalShelterApp**: Main application container with navigation and routing
- **AddAnimalForm**: Comprehensive form for registering new animals
- **AnimalsList**: Display and manage all registered animals
- **AnimalDetails**: Detailed view of individual animals with medication management
- **TodaysMedications**: Daily medication dashboard with administration tracking
- **AddMedicationForm**: Schedule new medications for animals
- **HealthStatus**: Manage and display animal health/vaccination status

## 🏥 Data Models

### Animals

- Basic information (name, sex, coat, age)
- Owner details
- Treatment information
- Health/vaccination status
- User tracking for data ownership

### Medication Records

- Animal association
- Scheduling (date, time, end date)
- Medication details (name, dose)
- Administration tracking
- Observations and notes
- User tracking for administration

## 🚀 Getting Started

### Prerequisites

- Node.js (latest LTS version)
- npm or bun package manager

### Installation & Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development servers (frontend + Convex backend):

   ```bash
   npm run dev
   ```

   - Opens the frontend at `http://localhost:5173`
   - Starts a local Convex backend
   - On first run, the Convex CLI may prompt you to sign in and will generate the required environment variables (e.g., `VITE_CONVEX_URL`) in `.env.local`

3. Access the application at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Code Quality

The project includes comprehensive linting and type checking:

```bash
npm run lint
```

This command runs TypeScript compilation, Convex validation, and builds the project to ensure code quality.

## 🏗 Project Structure

```
sistema-ctg/
├── src/                          # Frontend source code
│   ├── components/              # Reusable UI components
│   ├── AnimalShelterApp.tsx     # Main application component
│   └── main.tsx                 # Application entry point
├── convex/                      # Backend logic and database schema
│   ├── animals.ts              # Animal-related database operations
│   ├── medications.ts          # Medication management operations
│   ├── schema.ts               # Database schema definitions
│   └── auth.ts                 # Authentication configuration
└── package.json                # Dependencies and scripts
```

## 🔐 Authentication

The system uses Convex Auth for secure user authentication, in the demo:

- All data is shared by the users
- All operations are properly authenticated
- User sessions are managed securely

## 📱 User Experience

The application is designed with animal shelter staff in mind, providing:

- **Quick Access**: Fast navigation between frequently used features
- **Clear Visual Feedback**: Color-coded status indicators and progress tracking
- **Efficient Workflows**: Streamlined processes for daily medication administration
- **Data Integrity**: Real-time validation and error handling
- **Accessibility**: Clean, readable interface suitable for various user skill levels

## 🏥 Convex Deployment

This project is connected to the a Convex deployment named.

For more information about Convex development and deployment:

- [Convex Documentation](https://docs.convex.dev/)
- [Convex Auth Documentation](https://auth.convex.dev/)
- [Hosting and Deployment Guide](https://docs.convex.dev/production/)

This system streamlines animal shelter operations by providing a centralized platform for managing animal care, medication schedules, and treatment tracking, ultimately improving the quality of care provided to animals in shelters.
