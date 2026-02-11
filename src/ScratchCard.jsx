import React, { useRef, useEffect, useState, useCallback } from 'react';

const ScratchCard = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const scratchCountRef = useRef(0);

    // Initialize Canvas with elegant wrapping paper design
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');

        const init = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            // Calculate scale factor relative to a base width (e.g. 500px for mobile)
            const scale = Math.min(canvas.width, canvas.height) / 500;
            const safeScale = Math.max(scale, 0.6); // Don't get too small

            // 1. Red Velvet Background (Terciopelo Rojo)
            const bgGradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width
            );
            bgGradient.addColorStop(0, '#9f1239');   // Center: Deep Rose/Red
            bgGradient.addColorStop(0.6, '#881337'); // Mid: Darker Red
            bgGradient.addColorStop(1, '#4c0519');   // Edge: Very Dark Red (Shadow)

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Velvet Texture (Noise)
            drawPaperTexture(ctx, canvas.width, canvas.height);

            const centerY = canvas.height / 2;
            const centerX = canvas.width / 2;

            // Scaled ribbon height (base 60)
            const ribbonHeight = 60 * safeScale;

            // Draw Gold Satin Ribbon - Horizontal
            drawGoldRibbon(ctx, 0, centerY - ribbonHeight / 2, canvas.width, ribbonHeight, true, safeScale);

            // Draw Gold Satin Ribbon - Vertical
            drawGoldRibbon(ctx, centerX - ribbonHeight / 2, 0, ribbonHeight, canvas.height, false, safeScale);

            // Draw Floral Gold Bow
            drawFloralBow(ctx, centerX, centerY, safeScale);

            // Elegant instruction text
            const fontSize = Math.max(16, 24 * safeScale);
            ctx.font = `italic 300 ${fontSize}px "Playfair Display", serif`;
            ctx.fillStyle = '#eaddcf'; // Champagne / Off-white
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetY = 2;
            ctx.fillText('Desliza para descubrir tu sorpresa', centerX, canvas.height - (80 * safeScale));
        };

        const drawPaperTexture = (ctx, width, height) => {
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                // Heavier noise for velvet
                const noise = (Math.random() - 0.5) * 15;
                data[i] = Math.min(255, Math.max(0, data[i] + noise));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
            }
            ctx.putImageData(imageData, 0, 0);
        };

        const drawGoldRibbon = (ctx, x, y, width, height, isHorizontal, scale) => {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(x + (5 * scale), y + (5 * scale), width, height);

            // Gold Ribbon Gradient
            const gradient = isHorizontal
                ? ctx.createLinearGradient(x, y, x, y + height)
                : ctx.createLinearGradient(x, y, x + width, y);

            // Champagne/Gold Palette
            gradient.addColorStop(0, '#8a6d3b');    // Dark Gold Border
            gradient.addColorStop(0.1, '#c5a059');   // Gold
            gradient.addColorStop(0.4, '#f3e5ab');   // Champagne Highlight
            gradient.addColorStop(0.6, '#f3e5ab');   // Champagne Highlight
            gradient.addColorStop(0.9, '#c5a059');   // Gold
            gradient.addColorStop(1, '#8a6d3b');     // Dark Gold Border

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, width, height);

            // Inner Gold Threads/Stitching
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            const padding = 5 * scale;
            if (isHorizontal) {
                ctx.moveTo(x, y + padding); ctx.lineTo(x + width, y + padding);
                ctx.moveTo(x, y + height - padding); ctx.lineTo(x + width, y + height - padding);
            } else {
                ctx.moveTo(x + padding, y); ctx.lineTo(x + padding, y + height);
                ctx.moveTo(x + width - padding, y); ctx.lineTo(x + width - padding, y + height);
            }
            ctx.stroke();

            // Text on Ribbon "FOR YOU"
            ctx.save();
            const titleSize = Math.max(10, 14 * scale);
            const subTitleSize = Math.max(6, 8 * scale);
            ctx.font = `bold ${titleSize}px "Arial", sans-serif`;
            ctx.fillStyle = 'rgba(138, 109, 59, 0.7)'; // Embossed gold look
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (isHorizontal) {
                // Repeat text horizontally
                const textSpacing = 200 * scale;
                for (let tx = x; tx < x + width; tx += textSpacing) {
                    // "FOR YOU"
                    ctx.fillText("FOR YOU", tx + (50 * scale), y + height / 2 - (8 * scale));
                    // Small text below
                    ctx.font = `${subTitleSize}px "Arial", sans-serif`;
                    ctx.fillText("A THOUSAND TIMES OVER", tx + (50 * scale), y + height / 2 + (8 * scale));
                    ctx.font = `bold ${titleSize}px "Arial", sans-serif`;
                }
            } else {
                // Repeat text vertically
                const textSpacing = 200 * scale;
                for (let ty = y; ty < y + height; ty += textSpacing) {
                    ctx.save();
                    ctx.translate(x + width / 2, ty + (50 * scale));
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText("FOR YOU", 0, -(8 * scale));
                    ctx.font = `${subTitleSize}px "Arial", sans-serif`;
                    ctx.fillText("A THOUSAND TIMES OVER", 0, (8 * scale));
                    ctx.restore();
                }
            }
            ctx.restore();
        };

        const drawFloralBow = (ctx, cx, cy, scale) => {
            // Global shadow for the whole bow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 30 * scale;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 15 * scale;

            const tailSize = 140 * scale;
            const loopSize = 100 * scale;

            // Draw Tails (Bottom layer)
            drawGoldTail(ctx, cx, cy, -25, tailSize, 'left', scale);
            drawGoldTail(ctx, cx, cy, 25, tailSize, 'right', scale);

            // Re-configure shadow for loops
            ctx.shadowBlur = 20 * scale;

            // Draw 4 Main Loops (Flower shape)
            // Diagonals for a full "X" shape
            drawGoldLoop(ctx, cx, cy, -45, loopSize, scale); // Top Left
            drawGoldLoop(ctx, cx, cy, 45, loopSize, scale);  // Top Right
            drawGoldLoop(ctx, cx, cy, -135, loopSize, scale); // Bottom Left
            drawGoldLoop(ctx, cx, cy, 135, loopSize, scale); // Bottom Right

            // Center Knot
            ctx.shadowBlur = 10 * scale;
            drawGoldKnot(ctx, cx, cy, scale);

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
        };

        const drawGoldLoop = (ctx, cx, cy, angleDeg, size, scale) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angleDeg * Math.PI / 180);

            // Gold Loop Gradient
            const gradient = ctx.createLinearGradient(0, -20 * scale, 0, size);
            gradient.addColorStop(0, '#c5a059');
            gradient.addColorStop(0.5, '#f3e5ab'); // Highlight middle
            gradient.addColorStop(1, '#8a6d3b');

            ctx.fillStyle = gradient;

            // Loop Shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-size / 2, -size / 4, -size, size / 2, 0, size); // Outer curve
            ctx.bezierCurveTo(size, size / 2, size / 2, -size / 4, 0, 0); // Inner return
            ctx.fill();

            // Shine Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.ellipse(0, size * 0.6, size / 4, size / 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Edge definition
            ctx.strokeStyle = 'rgba(138, 109, 59, 0.3)';
            ctx.lineWidth = 1 * scale;
            ctx.stroke();

            ctx.restore();
        };

        const drawGoldTail = (ctx, cx, cy, angleDeg, size, side, scale) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angleDeg * Math.PI / 180); // Rotate to approximate direction

            // Gold Tail Gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, size);
            gradient.addColorStop(0, '#8a6d3b');
            gradient.addColorStop(0.4, '#c5a059');
            gradient.addColorStop(1, '#f3e5ab');

            ctx.fillStyle = gradient;

            // Flowy Shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-15 * scale, size / 2, -10 * scale, size); // Left edge
            ctx.lineTo(10 * scale, size - (10 * scale)); // Bottom cut
            ctx.quadraticCurveTo(15 * scale, size / 2, 0, 0); // Right edge
            ctx.fill();

            ctx.restore();
        };

        const drawGoldKnot = (ctx, cx, cy, scale) => {
            // Complex knotted center
            const size = 25 * scale;

            // Base shadow
            ctx.fillStyle = '#785c30';
            ctx.beginPath();
            ctx.arc(cx, cy, size / 2 + (2 * scale), 0, Math.PI * 2);
            ctx.fill();

            // Main knot
            const grad = ctx.createRadialGradient(cx - (5 * scale), cy - (5 * scale), 2 * scale, cx, cy, size);
            grad.addColorStop(0, '#f3e5ab');
            grad.addColorStop(0.5, '#c5a059');
            grad.addColorStop(1, '#8a6d3b');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy + (2 * scale), size / 2, 0, Math.PI * 2);
            ctx.fill();

            // Twist details
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 2 * scale;
            ctx.beginPath();
            ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
            ctx.stroke();
        };

        init();

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const checkProgress = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || isRevealed) return;

        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        let transparent = 0;
        const step = 200;

        for (let i = 0; i < data.length; i += 4 * step) {
            if (data[i + 3] === 0) {
                transparent++;
            }
        }

        const totalChecked = data.length / (4 * step);
        const percent = transparent / totalChecked;

        if (percent > 0.50) {
            setIsRevealed(true);
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 300);
        }
    }, [onComplete, isRevealed]);

    const scratch = (clientX, clientY) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';

        // Realistic paper tearing effect
        const pieces = 3;
        for (let i = 0; i < pieces; i++) {
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;
            const size = Math.random() * 20 + 30;

            ctx.beginPath();
            const points = 8;
            for (let j = 0; j < points; j++) {
                const angle = (j / points) * Math.PI * 2;
                const radius = size * (0.7 + Math.random() * 0.6);
                const px = x + offsetX + Math.cos(angle) * radius;
                const py = y + offsetY + Math.sin(angle) * radius;

                if (j === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.fill();
        }

        scratchCountRef.current += 1;
        if (scratchCountRef.current > 15) {
            checkProgress();
            scratchCountRef.current = 0;
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        scratch(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        scratch(touch.clientX, touch.clientY);
    };

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full touch-none cursor-pointer"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => { setIsDragging(false); checkProgress(); }}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => { setIsDragging(false); checkProgress(); }}
                onTouchMove={handleTouchMove}
            />
        </div>
    );
};

export default ScratchCard;
