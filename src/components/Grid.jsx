import React, { useState, useCallback, useRef, useEffect } from 'react';
import { throttle } from '../hooks/debounce';
import './Grid.css';

/**
 * Reusable Grid component with full keyboard and mouse interaction.
 *
 * Keyboard: Arrow keys to navigate, Enter/Space to select.
 * Mouse: Soft hover highlight, row/column highlight, gentle ripple on click.
 * Accessibility: ARIA grid roles, live region for coordinate readout.
 *
 * Props:
 * - size: number (e.g., 6 for 6x6)
 * - onCellClick: (x, y) => void
 * - target: { x, y } | null
 * - highlightCell: { x, y } | null
 * - mode: 'play' | 'learn'
 * - showLabels: boolean
 * - disabled: boolean
 */
export default function Grid({
    size = 6,
    onCellClick,
    target,
    highlightCell,
    mode = 'play',
    showLabels = true,
    disabled = false,
}) {
    const [hoveredCell, setHoveredCell] = useState(null);
    const [focusedCell, setFocusedCell] = useState({ x: 0, y: 0 });
    const [rippleCell, setRippleCell] = useState(null);
    const gridRef = useRef(null);
    const cellRefs = useRef({});
    const lastClickTime = useRef(0);

    // Build a key for cell refs
    const cellKey = (x, y) => `${x}-${y}`;

    // Focus a specific cell programmatically
    const focusCellAt = useCallback((x, y) => {
        const clamped = {
            x: Math.max(0, Math.min(x, size - 1)),
            y: Math.max(0, Math.min(y, size - 1)),
        };
        setFocusedCell(clamped);
        const ref = cellRefs.current[cellKey(clamped.x, clamped.y)];
        if (ref) ref.focus();
    }, [size]);

    // Throttled arrow key handler to prevent overstimulation
    const handleArrowNav = useCallback(
        throttle((direction, currentX, currentY) => {
            switch (direction) {
                case 'ArrowRight': focusCellAt(currentX + 1, currentY); break;
                case 'ArrowLeft': focusCellAt(currentX - 1, currentY); break;
                case 'ArrowUp': focusCellAt(currentX, currentY + 1); break;
                case 'ArrowDown': focusCellAt(currentX, currentY - 1); break;
            }
        }, 120),
        [focusCellAt]
    );

    const handleCellClick = useCallback((x, y) => {
        if (disabled) return;

        // Prevent double-click fast triggering (300ms guard)
        const now = Date.now();
        if (now - lastClickTime.current < 300) return;
        lastClickTime.current = now;

        // Trigger ripple
        setRippleCell({ x, y });
        setTimeout(() => setRippleCell(null), 600);

        onCellClick && onCellClick(x, y);
    }, [onCellClick, disabled]);

    const handleKeyDown = useCallback((e, x, y) => {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleCellClick(x, y);
                break;
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                e.preventDefault();
                handleArrowNav(e.key, x, y);
                break;
            default:
                break;
        }
    }, [handleCellClick, handleArrowNav]);

    const rows = [];
    for (let y = size - 1; y >= 0; y--) {
        const cells = [];
        for (let x = 0; x < size; x++) {
            const isHovered = hoveredCell && hoveredCell.x === x && hoveredCell.y === y;
            const isFocused = focusedCell.x === x && focusedCell.y === y;
            const isHighlighted = highlightCell && highlightCell.x === x && highlightCell.y === y;
            const isRipple = rippleCell && rippleCell.x === x && rippleCell.y === y;
            const isRowHighlighted = (hoveredCell && hoveredCell.y === y) || (isFocused && mode === 'learn');
            const isColHighlighted = (hoveredCell && hoveredCell.x === x) || (isFocused && mode === 'learn');

            let cellClass = 'grid__cell';
            if (isHovered || isFocused) cellClass += ' grid__cell--hovered';
            if (isHighlighted) cellClass += ' grid__cell--correct';
            if (mode === 'learn' && (isRowHighlighted || isColHighlighted)) {
                cellClass += ' grid__cell--axis-highlight';
            }
            if (isRipple) cellClass += ' grid__cell--ripple';

            cells.push(
                <div
                    key={`${x}-${y}`}
                    ref={(el) => { cellRefs.current[cellKey(x, y)] = el; }}
                    className={cellClass}
                    role="gridcell"
                    tabIndex={isFocused ? 0 : -1}
                    aria-label={`Cell at column ${x}, row ${y}${isHighlighted ? ', correct answer' : ''}`}
                    aria-selected={isHighlighted || false}
                    onClick={() => handleCellClick(x, y)}
                    onKeyDown={(e) => handleKeyDown(e, x, y)}
                    onMouseEnter={() => setHoveredCell({ x, y })}
                    onMouseLeave={() => setHoveredCell(null)}
                    onFocus={() => {
                        setFocusedCell({ x, y });
                        setHoveredCell({ x, y });
                    }}
                    onBlur={() => setHoveredCell(null)}
                >
                    {isHighlighted && <span className="grid__star" aria-hidden="true">⭐</span>}
                    {isRipple && <span className="grid__ripple" aria-hidden="true" />}
                    {mode === 'learn' && (isHovered || isFocused) && (
                        <span className="grid__coord-label">({x},{y})</span>
                    )}
                </div>
            );
        }
        rows.push(
            <div key={`row-${y}`} className="grid__row" role="row">
                {showLabels && <div className="grid__label grid__label--y" aria-hidden="true">{y}</div>}
                {cells}
            </div>
        );
    }

    // Announce focused cell to screen readers
    const announcedCoord = focusedCell ? `Column ${focusedCell.x}, Row ${focusedCell.y}` : '';

    return (
        <div className="grid-wrapper">
            <div
                className="grid"
                ref={gridRef}
                role="grid"
                aria-label={`${size} by ${size} coordinate grid. Use arrow keys to navigate, Enter or Space to select.`}
            >
                {rows}
                {showLabels && (
                    <div className="grid__row grid__row--x-labels" aria-hidden="true">
                        <div className="grid__label" />
                        {Array.from({ length: size }, (_, i) => (
                            <div key={i} className="grid__label grid__label--x">{i}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* Screen reader announcement */}
            <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {announcedCoord}
            </div>

            {mode === 'learn' && (hoveredCell || focusedCell) && (
                <div className="grid__axis-info" role="status" aria-live="polite">
                    <span className="grid__axis-x">
                        X = {(hoveredCell || focusedCell).x} ➡️
                    </span>
                    <span className="grid__axis-y">
                        Y = {(hoveredCell || focusedCell).y} ⬆️
                    </span>
                </div>
            )}
        </div>
    );
}
