#!/bin/bash
# Script para iniciar servidor local de Cortex Quant Trader
# Uso: ./serve.sh [puerto]

PORT=${1:-8000}
DIR="$(cd "$(dirname "$0")" && pwd)/cortex_program_quant_traders/slides"

echo "=========================================="
echo "  CORTEX QUANT TRADER - Servidor Local"
echo "=========================================="
echo ""
echo "  Directorio: $DIR"
echo "  Puerto: $PORT"
echo ""
echo "  Abre en tu navegador:"
echo "  http://localhost:$PORT"
echo ""
echo "  Presiona Ctrl+C para detener"
echo "=========================================="
echo ""

cd "$DIR"
python3 -m http.server $PORT
