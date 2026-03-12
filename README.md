# N2WS Architecture Visualizer

An interactive technical guide and architecture visualization tool for N2WS Backup & Recovery MSP configurations.

## Overview

This application provides a comprehensive visual and technical breakdown of N2WS deployment models, specifically focusing on the **Centralized Worker VPC** architecture. It is designed to help architects and engineers understand the flow of data, security boundaries, and cost implications of different N2WS configurations.

## Key Features

- **Interactive Architecture Diagram**: Visualize the relationship between the MSP Central Account (Orchestration) and Customer Accounts.
- **Dynamic Flow Visualization**: Toggle between different deployment models (Customer vs. Centralized) and restore types (Hot vs. Cold) to see how data and control signals flow.
- **Cost Analysis**: Detailed breakdown of cost considerations for each architectural model.
- **Security Flow**: Deep dive into the IAM roles, cross-account permissions, and network security required for N2WS operations.
- **Worker Configuration**: Technical specifications and lifecycle management for N2WS Worker instances.
- **Design Considerations**: Best practices for multi-tenant and large-scale N2WS environments.

## Architectural Highlights

### Centralized Worker VPC
In this model, all N2WS Worker instances are launched within a dedicated VPC in the MSP Central Account. This simplifies network management and centralizes security auditing, while still allowing for cross-account backup and recovery of customer resources.

### Hot vs. Cold Restores
- **Hot Restores**: API-driven operations that utilize native AWS snapshots. No worker instances are required for these operations.
- **Cold Restores**: Data-streaming operations that require N2WS Worker instances to move data from repositories (S3) back to the target instances.

## Technical Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to `http://localhost:3000`
