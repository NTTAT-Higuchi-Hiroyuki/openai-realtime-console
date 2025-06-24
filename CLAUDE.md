# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an OpenAI Realtime Console application that demonstrates how to use the OpenAI Realtime API with WebRTC. The application enables real-time voice conversations with GPT-4o models and includes client-side function calling capabilities.

## Key Architecture

### Full-Stack Structure

- **Frontend**: React application with Vite bundling (client/ directory)
- **Backend**: Express.js server with SSR support using Vite middleware
- **Communication**: WebRTC data channels for real-time API events, HTTP for token generation

### Core Components

- `App.jsx`: Main application component managing WebRTC peer connections and session state
- `SessionControls.jsx`: UI for starting/stopping sessions and sending text messages  
- `ToolPanel.jsx`: Demonstrates function calling with color palette generation tool
- `EventLog.jsx`: Displays real-time API events for debugging

### WebRTC Integration

The application uses WebRTC peer connections to communicate with OpenAI's Realtime API:

- Audio streams for voice input/output
- Data channels for JSON event messaging
- Session tokens obtained via `/token` endpoint

## Development Commands

### Setup

```bash
# Copy environment file and add your OpenAI API key
cp .env.example .env

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start
```

### Build

```bash
# Build both client and server
npm run build

# Build client only
npm run build:client

# Build server only  
npm run build:server
```

### Code Quality

```bash
# Run ESLint with auto-fix
npm run lint
```

## Environment Configuration

Required environment variables in `.env`:

- `OPENAI_API_KEY`: Your OpenAI API key for Realtime API access
- `PORT`: Server port (defaults to 3000)

## API Integration

### Token Generation

The `/token` endpoint generates ephemeral session tokens for the OpenAI Realtime API using the configured API key. These tokens are used to establish WebRTC connections.

### Realtime API Model

Currently configured to use `gpt-4o-realtime-preview-2024-12-17` with `verse` voice.

## Function Calling Example

The ToolPanel component demonstrates client-side function calling:

- Registers a `display_color_palette` function during session initialization
- Handles function call responses and displays results
- Shows how to send follow-up prompts after function execution

## Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS, React Router
- **Backend**: Express.js, Node.js ES modules
- **Styling**: TailwindCSS with PostCSS and nesting support
- **Icons**: React Feather
- **Build**: Vite with React plugin and SSR support

このプロジェクトの従事者は日本語を主要なコミュニケーション言語として使用します。全てのドキュメント、コードコメント、コミットメッセージ、Github Issue、Pull Requestは日本語で記述されます。
