const ColorValues = require('values.js');

function mixColors(color1, color2, weight) {
    const p = weight / 100;
    const [r1, g1, b1] = color1.match(/\w\w/g).map((c) => parseInt(c, 16));
    const [r2, g2, b2] = color2.match(/\w\w/g).map((c) => parseInt(c, 16));
    const r = Math.round(r1 * p + r2 * (1 - p));
    const g = Math.round(g1 * p + g2 * (1 - p));
    const b = Math.round(b1 * p + b2 * (1 - p));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function generateTailwindShades(color) {
    const generator = new ColorValues(color);

    if (generator) {
        return {
            50: mixColors(generator.tint(67.5).hexString(), 'ffffff', 25),
            100: mixColors(generator.tint(60).hexString(), 'ffffff', 40),
            200: mixColors(generator.tint(52.5).hexString(), 'ffffff', 75),
            300: mixColors(generator.tint(30).hexString(), 'ffffff', 80),
            400: mixColors(generator.tint(22.5).hexString(), color, 100),
            500: color,
            600: mixColors(generator.shade(22.5).hexString(), color, 90),
            700: mixColors(generator.shade(25).hexString(), '000000', 80),
            800: mixColors(generator.shade(32.5).hexString(), '000000', 72.5),
            900: mixColors(generator.shade(51.5).hexString(), '000000', 81.5),
            950: mixColors(generator.shade(67.5).hexString(), '000000', 70),
        };
    }
}

function getShadesAsJsonString(shades, colorName, indentation, tabWidth) {
    const jsonOutput = JSON.stringify(shades, null, tabWidth);
    const lines = jsonOutput.split('\n');

    if (lines.length > 0) {
        lines[0] = `${colorName}: {`;

        for (let i = 1; i < lines.length; i++) {
            lines[i] = indentation + lines[i];
        }
    }

    return lines.join('\n').replace(/"([^"]+)":/g, '$1:') + ',';
}

function getShadesAsCssVariablesString(shades, colorName, indentation) {
    return Object.entries(shades)
        .map(([key, value], index) => {
            return `${index === 0 ? '' : ' '.repeat(indentation)}--${colorName}-${key}: ${value};`;
        })
        .join('\n');
}

module.exports = {
    generateTailwindShades,
    getShadesAsJsonString,
    getShadesAsCssVariablesString,
};
