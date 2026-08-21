/**
 * Station symbols. Geometry alone distinguishes every kind, so the plot survives
 * greyscale printing and colour-vision deficiency without relying on hue.
 */
export default function Glyph({ shape, size = 16 }) {
    const half = size / 2;

    const shapes = {
        triangle: <path d={`M ${half} 1.5 L ${size - 1.5} ${size - 2.5} L 1.5 ${size - 2.5} Z`} />,
        square: <rect x="2.5" y="2.5" width={size - 5} height={size - 5} />,
        circle: <circle cx={half} cy={half} r={half - 2.5} />,
        diamond: <path d={`M ${half} 1.5 L ${size - 1.5} ${half} L ${half} ${size - 1.5} L 1.5 ${half} Z`} />,
        cross: (
            <>
                <path d={`M ${half} 2 L ${half} ${size - 2}`} />
                <path d={`M 2 ${half} L ${size - 2} ${half}`} />
            </>
        ),
        benchmark: (
            <>
                <circle cx={half} cy={half} r={half - 2.5} />
                <circle cx={half} cy={half} r="1.4" className="glyph__core" />
            </>
        ),
    };

    return (
        <svg
            className="glyph"
            data-shape={shape}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden="true"
            focusable="false"
        >
            {shapes[shape] ?? shapes.circle}
        </svg>
    );
}
