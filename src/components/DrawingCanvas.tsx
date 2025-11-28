import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Pencil,
  Eraser,
  Circle,
  Square,
  Minus,
  Undo,
  Redo,
  Trash2,
  Save,
  Download,
  Home,
  Palette as PaletteIcon,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type Tool = 'pencil' | 'eraser' | 'line' | 'rectangle' | 'circle';

interface DrawingState {
  imageData: string;
}

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<DrawingState[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [drawingTitle, setDrawingTitle] = useState('Untitled Drawing');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load existing drawing if editing
    if (id) {
      const drawings = JSON.parse(localStorage.getItem('drawings') || '[]');
      const drawing = drawings.find((d: any) => d.id === id);
      if (drawing) {
        setDrawingTitle(drawing.title);
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          saveToHistory();
        };
        img.src = drawing.thumbnail;
      }
    } else {
      saveToHistory();
    }
  }, [id]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push({ imageData });
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const newStep = historyStep - 1;
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[newStep].imageData;
      setHistoryStep(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const newStep = historyStep + 1;
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[newStep].imageData;
      setHistoryStep(newStep);
    }
  };

  const clearCanvas = () => {
    if (!confirm('Are you sure you want to clear the canvas?')) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setStartPos(pos);
    setIsDrawing(true);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pencil') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 3;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getMousePos(e);

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getMousePos(e);

    if (tool === 'line') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'rectangle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(
        startPos.x,
        startPos.y,
        pos.x - startPos.x,
        pos.y - startPos.y
      );
    } else if (tool === 'circle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    setIsDrawing(false);
    saveToHistory();
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || !user) return;

    const thumbnail = canvas.toDataURL();
    const drawings = JSON.parse(localStorage.getItem('drawings') || '[]');

    if (id) {
      // Update existing drawing
      const index = drawings.findIndex((d: any) => d.id === id);
      if (index !== -1) {
        drawings[index] = {
          ...drawings[index],
          title: drawingTitle,
          thumbnail,
        };
      }
    } else {
      // Create new drawing
      const newDrawing = {
        id: Date.now().toString(),
        title: drawingTitle,
        thumbnail,
        createdAt: new Date().toISOString(),
        userId: user.id,
      };
      drawings.push(newDrawing);
    }

    localStorage.setItem('drawings', JSON.stringify(drawings));
    alert('Drawing saved successfully!');
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${drawingTitle}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <nav className="bg-white border-b px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <div className="w-px h-6 bg-gray-300" />
          <Input
            type="text"
            value={drawingTitle}
            onChange={(e) => setDrawingTitle(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={saveDrawing}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={downloadDrawing}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <div className="bg-white border-r p-4 w-64 flex flex-col gap-6 overflow-y-auto">
          <div>
            <Label className="mb-3 block">Tools</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={tool === 'pencil' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('pencil')}
                className="justify-start"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Pencil
              </Button>
              <Button
                variant={tool === 'eraser' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('eraser')}
                className="justify-start"
              >
                <Eraser className="w-4 h-4 mr-2" />
                Eraser
              </Button>
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Shapes</Label>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={tool === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('line')}
                className="justify-start"
              >
                <Minus className="w-4 h-4 mr-2" />
                Line
              </Button>
              <Button
                variant={tool === 'rectangle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('rectangle')}
                className="justify-start"
              >
                <Square className="w-4 h-4 mr-2" />
                Rectangle
              </Button>
              <Button
                variant={tool === 'circle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('circle')}
                className="justify-start"
              >
                <Circle className="w-4 h-4 mr-2" />
                Circle
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="color" className="mb-3 block">Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="brushSize" className="mb-3 block">
              Brush Size: {brushSize}px
            </Label>
            <Input
              id="brushSize"
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
          </div>

          <div className="border-t pt-4">
            <Label className="mb-3 block">Controls</Label>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyStep <= 0}
                className="justify-start"
              >
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyStep >= history.length - 1}
                className="justify-start"
              >
                <Redo className="w-4 h-4 mr-2" />
                Redo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <canvas
              ref={canvasRef}
              className="w-full h-[600px] bg-white border-2 border-gray-300 rounded-lg cursor-crosshair shadow-lg"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
