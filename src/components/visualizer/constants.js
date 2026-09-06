export const FINISH_PROPS = {
  matt: { roughness: 0.82, metalness: 0.0 },
  gloss: { roughness: 0.14, metalness: 0.0 },
  wood: { roughness: 0.48, metalness: 0.0 },
  metal: { roughness: 0.28, metalness: 0.88 },
  fabric: { roughness: 1.0, metalness: 0.0 },
  stone: { roughness: 0.32, metalness: 0.04 },
};

export const FINISH_MAP = {
  Matt: "matt", Glossy: "gloss", Natural: "wood", Sanded: "wood",
  Textured: "matt", Brushed: "metal", Plated: "metal", Polished: "stone",
};

export const COLOR_FAMILY_MAP = {
  Walnut: "#5a4329", Ivory: "#efe7d9", Brass: "#b08a4f", Nickel: "#9a9a9e",
  Natural: "#c9a97a", Teak: "#9b6b3f", Charcoal: "#33312f", White: "#f4f1ec",
};

export const BUILTIN_SLOTS = {
  floor: {
    label: "Floor",
    swatches: [
      { name: "Oak Laminate", color: "#b79263", finish: "wood" },
      { name: "Walnut Plank", color: "#5a4329", finish: "wood" },
      { name: "Ivory Tile", color: "#e9e2d4", finish: "stone" },
      { name: "Charcoal Tile", color: "#2b2b2e", finish: "stone" },
      { name: "Vinyl Grey", color: "#7c7f82", finish: "matt" },
    ],
  },
  walls: {
    label: "Walls",
    swatches: [
      { name: "Warm White", color: "#efe7d9", finish: "matt" },
      { name: "Sand", color: "#d8c4a4", finish: "matt" },
      { name: "Sage", color: "#9aa888", finish: "matt" },
      { name: "Charcoal", color: "#33312f", finish: "matt" },
      { name: "Navy Accent", color: "#28364a", finish: "gloss" },
    ],
  },
  primary: {
    label: "Upholstery",
    swatches: [
      { name: "Oatmeal", color: "#cdbb97", finish: "fabric" },
      { name: "Forest", color: "#3a4a3f", finish: "fabric" },
      { name: "Rust", color: "#8a4b2c", finish: "fabric" },
      { name: "Slate Blue", color: "#3e4e63", finish: "fabric" },
      { name: "Ink Black", color: "#1c1c1e", finish: "fabric" },
    ],
  },
  cabinetry: {
    label: "Cabinetry",
    swatches: [
      { name: "White Gloss", color: "#f4f1ec", finish: "gloss" },
      { name: "Walnut Veneer", color: "#5b3d28", finish: "wood" },
      { name: "Oak Veneer", color: "#a3784f", finish: "wood" },
      { name: "Graphite", color: "#34363a", finish: "matt" },
      { name: "Brass", color: "#b08a4f", finish: "metal" },
    ],
  },
};

export const CATALOG_TO_SLOT = {
  floor: ["Laminates"],
  walls: ["Laminates"],
  cabinetry: ["Laminates", "Veneer", "Custom Pieces"],
};
