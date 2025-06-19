#!/usr/bin/env node

/**
 * Production startup script for Railway deployment
 */

console.log(`
██████╗  █████╗ ██╗██╗     ██╗    ██╗ █████╗ ██╗   ██╗
██╔══██╗██╔══██╗██║██║     ██║    ██║██╔══██╗╚██╗ ██╔╝
██████╔╝███████║██║██║     ██║ █╗ ██║███████║ ╚████╔╝ 
██╔══██╗██╔══██║██║██║     ██║███╗██║██╔══██║  ╚██╔╝  
██║  ██║██║  ██║██║███████╗╚███╔███╔╝██║  ██║   ██║   
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   
                                                       
██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗    
██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝    
██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝     
██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝      
██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║       
╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝       
`);

// Process command line arguments
process.argv.forEach((arg) => {
  if (arg === '--production' || arg === '-p') {
    process.env.NODE_ENV = 'production';
  }
});

// Set default environment if not specified
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Critical environment variable check
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

// Check for missing environment variables
if (missingVars.length > 0) {
  console.error(`
❌ ERROR: Missing required environment variables:
${missingVars.map(v => `   - ${v}`).join('\n')}

Please set these environment variables and try again.
  `);
  
  // Don't exit in production on Railway (it will just restart container)
  if (process.env.RAILWAY_ENVIRONMENT !== 'production') {
    process.exit(1);
  }
}

// Start the application
require('./server.js');
