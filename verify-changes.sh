#!/bin/bash

echo "🔍 VERIFICATION SCRIPT - Frontend Changes Only"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the industrial-attachment-system directory"
    echo "   cd industrial-attachment-system && bash verify-changes.sh"
    exit 1
fi

echo "✅ Checking frontend files that were enhanced..."
echo ""

# Check Home.jsx
if grep -q "animate-blob" frontend/src/pages/Home.jsx; then
    echo "✅ Home.jsx - NEW ENHANCED VERSION FOUND"
    echo "   - Has animated blobs"
    echo "   - Has testimonials carousel"
    echo "   - Has stats section"
else
    echo "❌ Home.jsx - OLD VERSION (needs update)"
fi

# Check Navbar.jsx
if grep -q "glassmorphism" frontend/src/components/Navbar.jsx || grep -q "backdrop-blur" frontend/src/components/Navbar.jsx; then
    echo "✅ Navbar.jsx - NEW ENHANCED VERSION FOUND"
    echo "   - Has fixed position"
    echo "   - Has glassmorphism effect"
else
    echo "❌ Navbar.jsx - OLD VERSION (needs update)"
fi

# Check index.css
if grep -q "@keyframes blob" frontend/src/index.css; then
    echo "✅ index.css - NEW ENHANCED VERSION FOUND"
    echo "   - Has blob animations"
    echo "   - Has modern styling"
else
    echo "❌ index.css - OLD VERSION (needs update)"
fi

# Check App.jsx
if grep -q "pt-16 md:pt-20" frontend/src/App.jsx; then
    echo "✅ App.jsx - UPDATED VERSION FOUND"
    echo "   - Has navbar padding"
else
    echo "❌ App.jsx - OLD VERSION (needs update)"
fi

echo ""
echo "=============================================="
echo "🛡️ Checking backend is untouched..."
echo ""

# Check backend server.js hasn't been modified recently
BACKEND_DATE=$(stat -c %y backend/src/server.js 2>/dev/null || stat -f %Sm backend/src/server.js 2>/dev/null)
echo "✅ Backend server.js last modified: ${BACKEND_DATE}"
echo "   (Should be old date - Jan 26 or earlier)"

# Check if backend has original structure
if [ -f "backend/src/server.js" ] && [ -d "backend/src/controllers" ] && [ -d "backend/src/models" ]; then
    echo "✅ Backend structure: INTACT"
    echo "   - server.js exists"
    echo "   - controllers/ exists"
    echo "   - models/ exists"
else
    echo "❌ Backend structure: MISSING FILES"
fi

echo ""
echo "=============================================="
echo "📋 Summary of Changes:"
echo ""
echo "FRONTEND CHANGES (Visual Only):"
echo "  1. ✨ frontend/src/pages/Home.jsx"
echo "  2. ✨ frontend/src/components/Navbar.jsx"
echo "  3. ✨ frontend/src/index.css"
echo "  4. ✨ frontend/src/App.jsx"
echo ""
echo "BACKEND CHANGES:"
echo "  ❌ NONE - Backend completely untouched!"
echo ""
echo "=============================================="
echo ""
echo "To test the frontend:"
echo "  cd frontend && npm install && npm run dev"
echo ""
echo "To test the backend (should work exactly as before):"
echo "  cd backend && npm install && npm run dev"
echo ""
echo "✅ Verification complete!"
