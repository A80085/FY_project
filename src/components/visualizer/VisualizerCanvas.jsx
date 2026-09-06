import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Maximize2, RotateCw, Sun, RefreshCw } from "lucide-react";
import { FINISH_PROPS, BUILTIN_SLOTS } from "./constants";

// ---------- texture helpers ----------
function makeCanvasTexture(size, draw) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d"), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

function shade(hex, amt) {
  const c = new THREE.Color(hex);
  c.r = Math.max(0, Math.min(1, c.r + amt));
  c.g = Math.max(0, Math.min(1, c.g + amt));
  c.b = Math.max(0, Math.min(1, c.b + amt));
  return "#" + c.getHexString();
}

function makePlankTexture(hex) {
  return makeCanvasTexture(512, (ctx, s) => {
    const planks = 6;
    const pw = s / planks;
    for (let i = 0; i < planks; i++) {
      // per-plank tonal variation
      const v = (Math.random() - 0.5) * 0.08;
      ctx.fillStyle = shade(hex, v);
      ctx.fillRect(i * pw, 0, pw, s);
      // grain
      ctx.strokeStyle = "rgba(0,0,0,0.10)";
      ctx.lineWidth = 1;
      for (let g = 0; g < 22; g++) {
        const y = Math.random() * s;
        ctx.beginPath();
        ctx.moveTo(i * pw, y);
        ctx.bezierCurveTo(i * pw + pw * 0.3, y + (Math.random() * 10 - 5), i * pw + pw * 0.7, y + (Math.random() * 10 - 5), i * pw + pw, y);
        ctx.stroke();
      }
    }
    // grooves between planks
    ctx.strokeStyle = "rgba(0,0,0,0.34)";
    ctx.lineWidth = 3;
    for (let i = 1; i < planks; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pw, 0);
      ctx.lineTo(i * pw, s);
      ctx.stroke();
    }
  });
}

function makeTileTexture(hex) {
  return makeCanvasTexture(512, (ctx, s) => {
    const tiles = 4;
    const tw = s / tiles;
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < tiles; i++) {
      for (let j = 0; j < tiles; j++) {
        const v = (Math.random() - 0.5) * 0.05;
        ctx.fillStyle = shade(hex, v);
        ctx.fillRect(i * tw + 2, j * tw + 2, tw - 4, tw - 4);
      }
    }
    ctx.strokeStyle = "rgba(0,0,0,0.28)";
    ctx.lineWidth = 3;
    for (let i = 0; i <= tiles; i++) {
      ctx.beginPath(); ctx.moveTo(i * tw, 0); ctx.lineTo(i * tw, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * tw); ctx.lineTo(s, i * tw); ctx.stroke();
    }
  });
}

function makeWallTexture(hex) {
  return makeCanvasTexture(512, (ctx, s) => {
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, s, s);
    // soft large-scale mottle (clouds of slightly darker/lighter)
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * s, y = Math.random() * s, r = 40 + Math.random() * 90;
      const v = (Math.random() - 0.5) * 0.05;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, shade(hex, v));
      g.addColorStop(1, shade(hex, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    // fine grain
    for (let i = 0; i < 2500; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 1.5, 1.5);
    }
  });
}

function makeFabricTexture(hex) {
  return makeCanvasTexture(256, (ctx, s) => {
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < s; i += 3) {
      ctx.strokeStyle = `rgba(0,0,0,${0.02 + Math.random() * 0.02})`;
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(s, i); ctx.stroke();
    }
    for (let i = 0; i < s; i += 3) {
      ctx.strokeStyle = `rgba(255,255,255,0.02)`;
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, s); ctx.stroke();
    }
  });
}

function makeMaterial(swatch, textureType) {
  const p = FINISH_PROPS[swatch.finish] || FINISH_PROPS.matt;
  const m = new THREE.MeshStandardMaterial({
    color: new THREE.Color(swatch.color),
    roughness: p.roughness,
    metalness: p.metalness,
  });
  if (swatch.customTex) {
    const t = swatch.customTex;
    if (textureType === "wall") t.repeat.set(2.5, 1.4);
    else if (textureType === "plank" || textureType === "tile") t.repeat.set(2.5, 2.5);
    else t.repeat.set(2, 2);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.needsUpdate = true;
    m.map = t;
    m.color.set(0xffffff);
    return m;
  }
  if (textureType === "plank") {
    const t = makePlankTexture(swatch.color);
    t.repeat.set(2.5, 2.5);
    m.map = t; m.bumpMap = t; m.bumpScale = 0.03;
  } else if (textureType === "tile") {
    const t = makeTileTexture(swatch.color);
    t.repeat.set(3, 3);
    m.map = t; m.bumpMap = t; m.bumpScale = 0.04;
  } else if (textureType === "wall") {
    const t = makeWallTexture(swatch.color);
    t.repeat.set(2.5, 1.4);
    m.map = t;
  } else if (textureType === "fabric") {
    const t = makeFabricTexture(swatch.color);
    t.repeat.set(3, 3);
    m.map = t;
  }
  return m;
}

// ---------- geometry helpers ----------
const box = (w, h, d, mat) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
};
const rbox = (w, h, d, r, mat) => {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
};
const cyl = (rTop, rBot, h, mat, seg = 24) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
};
const place = (mesh, x, y, z, group) => {
  mesh.position.set(x, y, z);
  group.add(mesh);
  return mesh;
};

let _contactTex;
function contactTexture() {
  if (_contactTex) return _contactTex;
  _contactTex = makeCanvasTexture(128, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(0,0,0,0.42)");
    g.addColorStop(0.6, "rgba(0,0,0,0.16)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.clearRect(0, 0, s, s);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  _contactTex.wrapS = _contactTex.wrapT = THREE.ClampToEdgeWrapping;
  _contactTex.userData = { custom: true };
  return _contactTex;
}
function contactShadow(rx, rz, ox = 0, oz = 0) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(rx * 2, rz * 2),
    new THREE.MeshBasicMaterial({ map: contactTexture(), transparent: true, depthWrite: false })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.set(ox, 0.022, oz);
  m.castShadow = false;
  m.receiveShadow = false;
  return m;
}

// ---------- furniture builders ----------
function buildSofa(mats) {
  const g = new THREE.Group();
  g.add(contactShadow(1.95, 0.95));
  const fab = mats.primary;
  const wood = mats.wood;
  // base
  place(rbox(3.3, 0.5, 1.5, 0.08, fab), 0, 0.42, 0, g);
  // arms
  place(rbox(0.34, 0.62, 1.5, 0.08, fab), -1.6, 0.56, 0, g);
  place(rbox(0.34, 0.62, 1.5, 0.08, fab), 1.6, 0.56, 0, g);
  // backrest
  place(rbox(3.2, 0.82, 0.28, 0.06, fab), 0, 0.86, -0.6, g);
  // seat cushions
  for (let i = -1; i <= 1; i++) {
    const c = rbox(0.98, 0.22, 1.16, 0.06, fab);
    c.position.set(i * 1.04, 0.74, 0.08);
    g.add(c);
  }
  // back cushions
  for (let i = -1; i <= 1; i++) {
    const c = rbox(0.98, 0.52, 0.24, 0.08, fab);
    c.position.set(i * 1.04, 1.0, -0.46);
    c.rotation.x = -0.16;
    g.add(c);
  }
  // throw cushion (contrast)
  const tc = rbox(0.5, 0.4, 0.2, 0.06, mats.accent);
  tc.position.set(-0.95, 1.02, -0.3);
  tc.rotation.z = 0.12;
  g.add(tc);
  // legs
  [[-1.5, -0.6], [1.5, -0.6], [-1.5, 0.6], [1.5, 0.6]].forEach(([x, z]) =>
    place(cyl(0.05, 0.06, 0.3, wood, 12), x, 0.15, z, g)
  );
  return g;
}

function buildArmchair(mats) {
  const g = new THREE.Group();
  g.add(contactShadow(0.78, 0.78));
  const fab = mats.primary;
  place(rbox(1.0, 0.46, 1.0, 0.08, fab), 0, 0.4, 0, g);
  place(rbox(0.28, 0.56, 1.0, 0.08, fab), -0.5, 0.54, 0, g);
  place(rbox(0.28, 0.56, 1.0, 0.08, fab), 0.5, 0.54, 0, g);
  place(rbox(1.0, 0.72, 0.26, 0.06, fab), 0, 0.78, -0.4, g);
  const c = rbox(0.86, 0.2, 0.86, 0.06, fab);
  c.position.set(0, 0.68, 0.04); g.add(c);
  [[-0.42, -0.4], [0.42, -0.4], [-0.42, 0.4], [0.42, 0.4]].forEach(([x, z]) =>
    place(cyl(0.045, 0.055, 0.34, mats.wood, 12), x, 0.17, z, g)
  );
  return g;
}

function buildCoffeeTable(mats) {
  const g = new THREE.Group();
  g.add(contactShadow(0.9, 0.55));
  place(rbox(1.5, 0.08, 0.85, 0.02, mats.wood), 0, 0.5, 0, g);
  place(rbox(1.4, 0.06, 0.78, 0.02, mats.wood), 0, 0.22, 0, g);
  [[-0.66, -0.36], [0.66, -0.36], [-0.66, 0.36], [0.66, 0.36]].forEach(([x, z]) =>
    place(box(0.07, 0.44, 0.07, mats.metal), x, 0.22, z, g)
  );
  // book stack
  place(rbox(0.42, 0.04, 0.3, 0.01, mats.accent), 0.2, 0.56, 0.05, g);
  place(rbox(0.4, 0.04, 0.28, 0.01, mats.stone), 0.18, 0.6, 0.06, g);
  // vase
  place(cyl(0.07, 0.05, 0.16, mats.stone, 16), -0.4, 0.59, -0.05, g);
  return g;
}

function buildTVUnit(mats) {
  const g = new THREE.Group();
  g.add(contactShadow(1.5, 0.4));
  // console
  place(rbox(2.7, 0.5, 0.5, 0.04, mats.cabinetry), 0, 0.28, 0, g);
  // door split
  place(box(0.02, 0.46, 0.51, mats.metal), 0, 0.28, 0, g);
  // open shelf
  place(box(2.6, 0.04, 0.5, mats.wood), 0, 0.42, 0, g);
  // console top surface sits at y = 0.53 — rest decor on it, not floating above
  place(box(0.3, 0.34, 0.04, mats.accent), 0.9, 0.70, 0, g);
  // tv slab resting on its stand, stand resting on console
  place(box(0.5, 0.06, 0.18, new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.5 })), 0, 0.56, 0.05, g);
  place(box(2.0, 1.12, 0.07, new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.35, metalness: 0.2 })), 0, 1.15, -0.05, g);
  return g;
}

function buildSideTable(mats) {
  const g = new THREE.Group();
  g.add(contactShadow(0.4, 0.4));
  place(rbox(0.55, 0.05, 0.55, 0.02, mats.wood), 0, 0.55, 0, g);
  [[-0.24, -0.24], [0.24, -0.24], [-0.24, 0.24], [0.24, 0.24]].forEach(([x, z]) =>
    place(box(0.05, 0.55, 0.05, mats.metal), x, 0.275, z, g)
  );
  return g;
}

function buildFloorLamp(mats) {
  const g = new THREE.Group();
  g.add(contactShadow(0.18, 0.18));
  place(cyl(0.07, 0.06, 0.03, mats.metal, 16), 0, 0.015, 0, g);
  place(cyl(0.014, 0.014, 0.62, mats.metal, 10), 0, 0.34, 0, g);
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.17, 0.2, 24),
    new THREE.MeshStandardMaterial({ color: 0xfff6e6, roughness: 0.85, emissive: 0xffdca0, emissiveIntensity: 0.7 })
  );
  shade.position.y = 0.65; shade.castShadow = true; g.add(shade);
  const glow = new THREE.PointLight(0xffd9a0, 0.35, 4, 2);
  glow.position.y = 0.62; g.add(glow);
  return g;
}

function buildRug(mats, w, d) {
  const base = new THREE.Color(mats.primarySwatch.color).lerp(new THREE.Color("#ffffff"), 0.35);
  const tex = makeCanvasTexture(256, (ctx, s) => {
    ctx.fillStyle = "#" + base.getHexString();
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, s - 20, s - 20);
    ctx.lineWidth = 3; ctx.strokeRect(22, 22, s - 44, s - 44);
  });
  const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 });
  const r = box(w, 0.02, d, m);
  r.position.y = 0.016; r.castShadow = false; r.receiveShadow = true;
  const g = new THREE.Group(); g.add(r); return g;
}

function buildPlant(mats, scale = 1) {
  const g = new THREE.Group();
  place(cyl(0.18 * scale, 0.14 * scale, 0.4 * scale, mats.stone, 18), 0, 0.2 * scale, 0, g);
  place(cyl(0.16 * scale, 0.12 * scale, 0.04 * scale, new THREE.MeshStandardMaterial({ color: 0x2a2a25, roughness: 1 }), 16), 0, 0.4 * scale, 0, g);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x8a6f48, roughness: 0.9 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x3f5d3a, roughness: 0.7 });
  const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x4f7247, roughness: 0.7 });
  // single thin central stem from the soil up into the foliage
  const stemH = 0.3 * scale;
  const stem = cyl(0.016 * scale, 0.012 * scale, stemH, stemMat, 7);
  stem.position.set(0, 0.4 * scale + stemH / 2, 0);
  g.add(stem);
  g.add(contactShadow(0.28 * scale, 0.28 * scale));
  // foliage kept at its original compact height — irregular, non-uniform blobs
  for (let i = 0; i < 5; i++) {
    const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16 * scale, 0), i % 2 ? leafMat : leafMat2);
    leaf.position.set((Math.random() - 0.5) * 0.22 * scale, 0.55 * scale + Math.random() * 0.3 * scale, (Math.random() - 0.5) * 0.22 * scale);
    leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const s = 0.8 + Math.random() * 0.5;
    leaf.scale.set(s * (0.82 + Math.random() * 0.32), s * (0.7 + Math.random() * 0.4), s * (0.82 + Math.random() * 0.32));
    leaf.castShadow = true;
    g.add(leaf);
  }
  return g;
}

function buildWallArt(mats, w, h, color) {
  const g = new THREE.Group();
  const frame = rbox(w, h, 0.05, 0.01, mats.wood);
  g.add(frame);
  const inset = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.08, h - 0.08), new THREE.MeshStandardMaterial({ color, roughness: 0.6 }));
  inset.position.z = 0.026; g.add(inset);
  return g;
}

function buildBed(mats) {
  const g = new THREE.Group();
  g.add(contactShadow(1.95, 2.5, 0, 0.2));
  // frame
  place(rbox(3.4, 0.34, 4.6, 0.04, mats.wood), 0, 0.2, 0.2, g);
  // mattress / duvet
  place(rbox(3.2, 0.3, 4.3, 0.06, mats.primary), 0, 0.52, 0.25, g);
  // folded throw at foot
  place(rbox(3.2, 0.1, 0.7, 0.04, mats.accent), 0, 0.66, 1.6, g);
  // headboard (upholstered panel)
  place(rbox(3.4, 1.2, 0.18, 0.06, mats.primary), 0, 0.8, -2.05, g);
  // pillows
  place(rbox(1.45, 0.2, 0.7, 0.08, mats.fabricLight), -0.78, 0.74, -1.55, g);
  place(rbox(1.45, 0.2, 0.7, 0.08, mats.fabricLight), 0.78, 0.74, -1.55, g);
  // legs
  [[-1.55, -2.0], [1.55, -2.0], [-1.55, 2.0], [1.55, 2.0]].forEach(([x, z]) =>
    place(cyl(0.05, 0.06, 0.16, mats.wood, 12), x, 0.08, z, g)
  );
  return g;
}

function buildNightstand(mats) {
  const g = new THREE.Group();
  g.add(contactShadow(0.45, 0.4));
  [[-0.26, -0.2], [0.26, -0.2], [-0.26, 0.2], [0.26, 0.2]].forEach(([x, z]) =>
    place(cyl(0.03, 0.04, 0.225, mats.wood, 10), x, 0.1125, z, g)
  );
  place(rbox(0.6, 0.55, 0.5, 0.03, mats.wood), 0, 0.5, 0, g);
  place(box(0.5, 0.02, 0.46, mats.metal), 0, 0.7, 0, g);
  place(cyl(0.035, 0.035, 0.05, mats.metal, 12), 0, 0.72, 0.2, g);
  // table lamp: base, stem, tapered shade
  place(cyl(0.07, 0.06, 0.025, mats.metal, 14), 0, 0.787, -0.08, g);
  place(cyl(0.012, 0.012, 0.1, mats.metal, 8), 0, 0.85, -0.08, g);
  const lampShade = cyl(0.045, 0.08, 0.12, new THREE.MeshStandardMaterial({ color: 0xfff3df, roughness: 0.8, emissive: 0xffd9a0, emissiveIntensity: 0.5 }), 18);
  lampShade.position.set(0, 0.96, -0.08); g.add(lampShade);
  return g;
}

function buildWardrobe(mats) {
  const g = new THREE.Group();
  g.add(contactShadow(1.2, 0.4));
  place(rbox(2.2, 2.2, 0.6, 0.03, mats.cabinetry), 0, 1.1, 0, g);
  // plinth
  place(box(2.2, 0.08, 0.62, mats.wood), 0, 0.04, 0, g);
  // door splits
  [-0.73, 0, 0.73].forEach((x) => place(box(0.02, 2.1, 0.61, mats.metal), x, 1.1, 0, g));
  // handles
  [-1.1, -0.36, 0.36, 1.1].forEach((x) => place(cyl(0.018, 0.018, 0.3, mats.metal, 12).rotateZ(Math.PI / 2), x, 1.1, 0.32, g));
  return g;
}

function buildKitchen(mats) {
  const g = new THREE.Group();
  const W = 5.6;
  // base cabinets
  place(rbox(W, 0.85, 0.62, 0.02, mats.cabinetry), 0, 0.43, -2.7, g);
  // countertop (stone)
  place(box(W + 0.12, 0.07, 0.72, mats.stone), 0, 0.89, -2.7, g);
  // backsplash
  place(box(W + 0.12, 0.58, 0.04, mats.stone), 0, 1.2, -2.99, g);
  // wall cabinets (split around the hood so it no longer clips them)
  place(rbox(2.05, 0.78, 0.4, 0.02, mats.cabinetry), -1.775, 2.05, -2.78, g);
  place(rbox(2.05, 0.78, 0.4, 0.02, mats.cabinetry), 1.775, 2.05, -2.78, g);
  // cabinet door lines
  [-2.28, -1.27, 1.27, 2.28].forEach((x) => {
    place(box(0.03, 0.78, 0.41, new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })), x, 2.05, -2.78, g);
  });
  // cooktop
  place(box(0.9, 0.02, 0.55, new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.25, metalness: 0.3 })), 0, 0.93, -2.7, g);
  for (let i = -1; i <= 1; i += 2) {
    place(cyl(0.08, 0.08, 0.02, new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.4 }), 20), i * 0.28, 0.95, -2.72, g);
  }
  // hood
  place(rbox(1.1, 0.32, 0.42, 0.03, mats.metal), 0, 2.42, -2.78, g);
  place(box(0.3, 0.3, 0.3, mats.metal), 0, 2.62, -2.78, g);
  // hood front vent slits
  const ventMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });
  [-0.07, 0, 0.07].forEach((dy) => place(box(0.5, 0.025, 0.02, ventMat), 0, 2.42 + dy, -2.57, g));
  // sink
  place(box(0.7, 0.04, 0.45, new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.6 })), 1.7, 0.9, -2.7, g);
  place(cyl(0.018, 0.018, 0.3, mats.metal, 10).rotateZ(Math.PI / 2), 1.7, 1.15, -2.65, g);
  place(cyl(0.018, 0.018, 0.12, mats.metal, 10).rotateZ(Math.PI / 2), 1.82, 1.28, -2.65, g);
  // island
  g.add(contactShadow(1.45, 0.75, 0, 0.7));
  place(rbox(2.4, 0.9, 1.0, 0.02, mats.cabinetry), 0, 0.45, 0.7, g);
  place(box(2.6, 0.07, 1.2, mats.stone), 0, 0.93, 0.7, g);
  // island stools
  for (let i = -1; i <= 1; i++) {
    place(cyl(0.13, 0.13, 0.05, mats.wood, 18), i * 0.7, 0.62, 1.5, g);
    place(cyl(0.03, 0.03, 0.6, mats.metal, 10), i * 0.7, 0.3, 1.5, g);
  }
  return g;
}

function buildPendant(x, y, z) {
  const g = new THREE.Group();
  const ceil = ROOM_DIMS.h;
  const cordH = ceil - y;
  const cord = cyl(0.012, 0.012, cordH, new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 }), 8);
  cord.position.set(0, y + cordH / 2, 0); g.add(cord);
  const shade = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0xfff3df, roughness: 0.7, emissive: 0xffdca8, emissiveIntensity: 0.9 })
  );
  shade.position.set(0, y, 0); shade.castShadow = true; g.add(shade);
  const glow = new THREE.PointLight(0xffd9a0, 0.4, 5, 2);
  glow.position.set(0, y, 0); g.add(glow);
  g.position.set(x, 0, z);
  return g;
}

// ---------- rooms ----------
const ROOMS = {
  living: {
    name: "Living Room",
    cameraTarget: [0, 0.7, -1.4],
    cameraPos: [3.4, 1.3, 4.6],
    build: (mats) => [
      { group: buildRug(mats, 4.0, 2.8), at: [0, 0, -0.7] },
      { group: buildSofa(mats), at: [0, 0, -1.6] },
      { group: buildCoffeeTable(mats), at: [0, 0, 0.5] },
      { group: buildTVUnit(mats), at: [-3.05, 0, -1.1], rotY: Math.PI / 2 },
      { group: buildSideTable(mats), at: [2.1, 0, -1.9] },
      { group: buildFloorLamp(mats), at: [2.1, 0.575, -1.9] },
      { group: buildArmchair(mats), at: [-2.4, 0, 1.8], rotY: Math.PI / 4 },
      { group: buildPlant(mats, 1.1), at: [2.9, 0, 2.4] },
      { group: buildWallArt(mats, 1.0, 0.7, mats.accent), at: [-1.1, 1.45, -3.42] },
      { group: buildWallArt(mats, 0.7, 0.9, mats.stone), at: [0.2, 1.5, -3.42] },
    ],
  },
  bedroom: {
    name: "Bedroom",
    cameraTarget: [0, 0.7, 0.1],
    cameraPos: [5.2, 2.3, 5.8],
    build: (mats) => [
      { group: buildRug(mats, 3.8, 4.0), at: [0, 0, 0.3] },
      { group: buildBed(mats), at: [0, 0, -0.1] },
      { group: buildNightstand(mats), at: [-2.0, 0, -2.45] },
      { group: buildNightstand(mats), at: [2.0, 0, -2.45] },
      { group: buildWardrobe(mats), at: [3.14, 0, 2.2], rotY: Math.PI / 2 },
      { group: buildPlant(mats, 0.8), at: [-2.9, 0, 2.6] },
      { group: buildWallArt(mats, 1.4, 0.6, mats.primary), at: [0, 1.95, -3.42], rotY: 0 },
    ],
  },
  kitchen: {
    name: "Modular Kitchen",
    cameraTarget: [0, 0.9, -0.4],
    cameraPos: [5.8, 2.6, 5.9],
    build: (mats) => {
      const items = [{ group: buildKitchen(mats), at: [0, 0, 0] }];
      items.push({ group: buildPendant(-0.7, 2.35, 0.7), at: [0, 0, 0] });
      items.push({ group: buildPendant(0.7, 2.35, 0.7), at: [0, 0, 0] });
      items.push({ group: buildPlant(mats, 0.55), at: [-0.95, 0.965, 0.45] });
      return items;
    },
  },
};


const VisualizerCanvas = forwardRef(({ room, selections, slotSwatches, autoRotate, lighting }, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useImperativeHandle(ref, () => ({
    resetView: () => {
      const def = ROOMS[room];
      const controls = controlsRef.current;
      const camera = cameraRef.current;
      if (!controls || !camera) return;
      camera.position.set(...def.cameraPos);
      controls.target.set(...def.cameraTarget);
      controls.update();
    },
    fullscreen: () => {
      const el = mountRef.current;
      if (!document.fullscreenElement) el.requestFullscreen?.();
      else document.exitFullscreen?.();
      setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
    }
  }));


  // build scene once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ece6da");
    scene.fog = new THREE.Fog("#ece6da", 18, 36);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // environment for reflections
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      const envScene = new THREE.Scene();
      const grad = makeCanvasTexture(256, (ctx, s) => {
        const g = ctx.createLinearGradient(0, 0, 0, s);
        g.addColorStop(0, "#fdf6e6");
        g.addColorStop(0.5, "#e8ddc8");
        g.addColorStop(1, "#b9a888");
        ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
      });
      grad.mapping = THREE.EquirectangularReflectionMapping;
      envScene.add(new THREE.Mesh(
        new THREE.SphereGeometry(50, 32, 16),
        new THREE.MeshBasicMaterial({ map: grad, side: THREE.BackSide })
      ));
      // bright "window" highlight
      const win = new THREE.Mesh(new THREE.PlaneGeometry(18, 9), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      win.position.set(12, 9, 6); win.lookAt(0, 0, 0); envScene.add(win);
      scene.environment = pmrem.fromScene(envScene, 0.08).texture;
    } catch (e) { /* env optional */ }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3.6;
    controls.maxDistance = 13;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.target.set(0, 0.6, 0);
    controlsRef.current = controls;

    // lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x6b5640, 0.2);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff1e0, 1.7);
    key.position.set(5.5, 8.5, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -9; key.shadow.camera.right = 9;
    key.shadow.camera.top = 9; key.shadow.camera.bottom = -9;
    key.shadow.camera.near = 1; key.shadow.camera.far = 30;
    key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 1.4;
    scene.add(key);
    const sky = new THREE.DirectionalLight(0xdfeaff, 0.5);
    sky.position.set(-6, 5, -3);
    scene.add(sky);
    const fill = new THREE.PointLight(0xffd9a8, 0.18, 22);
    fill.position.set(-4, 3, 5);
    scene.add(fill);
    scene._lights = { hemi, key, sky, fill };

    // room shell
    const floorSw = BUILTIN_SLOTS.floor.swatches[0];
    const wallSw = BUILTIN_SLOTS.walls.swatches[0];
    const floorTexType = floorSw.finish === "stone" ? "tile" : "plank";
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_DIMS.w, ROOM_DIMS.d), makeMaterial(floorSw, floorTexType));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    scene._floor = floor;

    const wallMat = makeMaterial(wallSw, "wall");
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_DIMS.w, ROOM_DIMS.h, 0.12), wallMat);
    backWall.position.set(0, ROOM_DIMS.h / 2, -ROOM_DIMS.d / 2);
    backWall.receiveShadow = true; scene.add(backWall);
    const sideWallGeo = new THREE.BoxGeometry(0.12, ROOM_DIMS.h, ROOM_DIMS.d);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-ROOM_DIMS.w / 2, ROOM_DIMS.h / 2, 0);
    leftWall.receiveShadow = true; scene.add(leftWall);
    const rightWall = leftWall.clone();
    rightWall.position.x = ROOM_DIMS.w / 2; scene.add(rightWall);
    scene._walls = [backWall, leftWall, rightWall];

    // baseboards
    const skirtMat = new THREE.MeshStandardMaterial({ color: 0xf3ece0, roughness: 0.7 });
    const skirt = new THREE.Group();
    [
      [0, 0.06, -ROOM_DIMS.d / 2 + 0.06, ROOM_DIMS.w - 0.12, 0.12, 0.05],
      [-ROOM_DIMS.w / 2 + 0.06, 0.06, 0, 0.05, 0.12, ROOM_DIMS.d - 0.12],
      [ROOM_DIMS.w / 2 - 0.06, 0.06, 0, 0.05, 0.12, ROOM_DIMS.d - 0.12],
    ].forEach(([x, y, z, w, h, d]) => {
      const m = box(w, h, d, skirtMat);
      m.position.set(x, y, z); m.castShadow = false; skirt.add(m);
    });
    scene.add(skirt);

    // crown molding
    const crown = new THREE.Group();
    [
      [0, ROOM_DIMS.h - 0.06, -ROOM_DIMS.d / 2 + 0.06, ROOM_DIMS.w - 0.12, 0.1, 0.05],
      [-ROOM_DIMS.w / 2 + 0.06, ROOM_DIMS.h - 0.06, 0, 0.05, 0.1, ROOM_DIMS.d - 0.12],
      [ROOM_DIMS.w / 2 - 0.06, ROOM_DIMS.h - 0.06, 0, 0.05, 0.1, ROOM_DIMS.d - 0.12],
    ].forEach(([x, y, z, w, h, d]) => {
      const m = box(w, h, d, skirtMat);
      m.position.set(x, y, z); m.castShadow = false; crown.add(m);
    });
    scene.add(crown);

    // window on left wall with proper frame + mullions
    const winGroup = new THREE.Group();
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 1.5),
      new THREE.MeshStandardMaterial({ color: 0xeaf2ff, emissive: 0xdfeaff, emissiveIntensity: 0.75, roughness: 0.25, metalness: 0.1 })
    );
    glass.rotation.y = Math.PI / 2;
    glass.position.set(-ROOM_DIMS.w / 2 + 0.07, 1.55, 0);
    winGroup.add(glass);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xf0e8da, roughness: 0.6 });
    const ww = 1.8, wh = 1.5;
    // top & bottom rails
    [-wh / 2, wh / 2].forEach((yy) => {
      const b = box(0.08, 0.08, ww + 0.1, frameMat);
      b.position.set(-ROOM_DIMS.w / 2 + 0.06, 1.55 + yy, 0); winGroup.add(b);
    });
    // left & right stiles + center mullion
    [-ww / 2, 0, ww / 2].forEach((zz) => {
      const b = box(0.08, wh + 0.08, 0.08, frameMat);
      b.position.set(-ROOM_DIMS.w / 2 + 0.06, 1.55, zz); winGroup.add(b);
    });
    scene.add(winGroup);

    // (curtain rod + panels removed — the rod read as a floating wood bar in every room)

    // doorway on right wall (architrave + dark recess)
    const doorGroup = new THREE.Group();
    const archMat = new THREE.MeshStandardMaterial({ color: 0xf3ece0, roughness: 0.7 });
    const dw = 1.1, dh = 2.2;
    // frame: two verticals + top
    [-dw / 2, dw / 2].forEach((zz) => {
      const b = box(0.08, dh, 0.12, archMat);
      b.position.set(ROOM_DIMS.w / 2 - 0.06, dh / 2, zz); doorGroup.add(b);
    });
    const top = box(0.08, 0.12, dw + 0.12, archMat);
    top.position.set(ROOM_DIMS.w / 2 - 0.06, dh, 0); doorGroup.add(top);
    // recess (dark)
    const recess = new THREE.Mesh(new THREE.PlaneGeometry(dw, dh), new THREE.MeshStandardMaterial({ color: 0x1a1612, roughness: 1 }));
    recess.rotation.y = -Math.PI / 2;
    recess.position.set(ROOM_DIMS.w / 2 - 0.08, dh / 2, 0);
    doorGroup.add(recess);
    scene.add(doorGroup);

    // ceiling
    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(ROOM_DIMS.w, ROOM_DIMS.d),
      new THREE.MeshStandardMaterial({ color: 0xf7f3ea, roughness: 1 })
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = ROOM_DIMS.h;
    ceil.receiveShadow = true;
    scene.add(ceil);
    // recessed downlight fixtures
    [-2, 0, 2].forEach((x) => {
      [-2, 2].forEach((z) => {
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.14, 24), new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.4 }));
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(x, ROOM_DIMS.h - 0.015, z);
        scene.add(ring);
        const d = new THREE.Mesh(new THREE.CircleGeometry(0.1, 20), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff3df, emissiveIntensity: 0.7 }));
        d.rotation.x = -Math.PI / 2;
        d.position.set(x, ROOM_DIMS.h - 0.02, z);
        scene.add(d);
      });
    });

    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) { o.material.dispose?.(); if (o.material.map && !o.material.map.userData?.custom) o.material.map.dispose?.(); }
      });
    };
  }, []);

  function currentMats() {
    const floorSw = slotSwatches.floor[selections.floor] || BUILTIN_SLOTS.floor.swatches[0];
    const wallsSw = slotSwatches.walls[selections.walls] || BUILTIN_SLOTS.walls.swatches[0];
    const primarySw = slotSwatches.primary[selections.primary] || BUILTIN_SLOTS.primary.swatches[0];
    const cabinetrySw = slotSwatches.cabinetry[selections.cabinetry] || BUILTIN_SLOTS.cabinetry.swatches[0];
    return {
      floor: { swatch: floorSw, mat: makeMaterial(floorSw, floorSw.finish === "stone" ? "tile" : "plank") },
      walls: { swatch: wallsSw, mat: makeMaterial(wallsSw, "wall") },
      primary: makeMaterial(primarySw, "fabric"),
      primarySwatch: primarySw,
      cabinetry: makeMaterial(cabinetrySw),
      wood: makeMaterial({ color: "#8a6240", finish: "wood" }, "plank"),
      stone: makeMaterial({ color: "#e6e0d5", finish: "stone" }, "tile"),
      metal: makeMaterial({ color: "#9a9a9e", finish: "metal" }),
      fabricLight: makeMaterial({ color: "#efe7d9", finish: "fabric" }, "fabric"),
      accent: makeMaterial({ color: "#b08a4f", finish: "fabric" }, "fabric"),
    };
  }

  // rebuild floor/walls + furniture whenever room or selections change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const mats = currentMats();

    scene._floor.material.dispose?.();
    scene._floor.material = mats.floor.mat;
    scene._walls.forEach((w) => { w.material.dispose?.(); w.material = mats.walls.mat; });

    if (scene._furniture) {
      scene._furniture.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) { o.material.dispose?.(); if (o.material.map && !o.material.map.userData?.custom) o.material.map.dispose?.(); }
      });
      scene.remove(scene._furniture);
    }
    const group = new THREE.Group();
    const def = ROOMS[room];
    def.build(mats).forEach((item) => {
      item.group.position.set(...item.at);
      if (item.rotY) item.group.rotation.y = item.rotY;
      group.add(item.group);
    });
    scene.add(group);
    scene._furniture = group;

    const controls = controlsRef.current;
    const camera = cameraRef.current;
    camera.position.set(...def.cameraPos);
    controls.target.set(...def.cameraTarget);
    controls.update();
  }, [room, selections, slotSwatches]);

  useEffect(() => {
    const lights = sceneRef.current?._lights;
    if (!lights) return;
    if (lighting === "warm") {
      lights.key.color.set(0xfff1e0); lights.key.intensity = 1.95;
      lights.sky.color.set(0xdfeaff); lights.sky.intensity = 0.4;
      lights.hemi.color.set(0xfff4e6); lights.hemi.groundColor.set(0x6b5640);
      lights.fill.color.set(0xffd9a8);
      sceneRef.current.background.set("#ece6da");
      rendererRef.current.toneMappingExposure = 1.08;
    } else if (lighting === "cool") {
      lights.key.color.set(0xeaf0ff); lights.key.intensity = 1.5;
      lights.sky.color.set(0xcfe0ff); lights.sky.intensity = 0.85;
      lights.hemi.color.set(0xdfe9ff); lights.hemi.groundColor.set(0x4a4a55);
      lights.fill.color.set(0xaec8ff);
      sceneRef.current.background.set("#e6edf3");
      rendererRef.current.toneMappingExposure = 1.0;
    } else {
      lights.key.color.set(0xffffff); lights.key.intensity = 1.55;
      lights.sky.color.set(0xffffff); lights.sky.intensity = 0.55;
      lights.hemi.color.set(0xffffff); lights.hemi.groundColor.set(0x777777);
      lights.fill.color.set(0xffffff);
      sceneRef.current.background.set("#f1ede4");
      rendererRef.current.toneMappingExposure = 1.05;
    }
  }, [lighting]);

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate;
  }, [autoRotate]);


  return (
    <div ref={mountRef} className="w-full aspect-[4/3] lg:aspect-auto lg:h-[620px]" />
  );
});

export default VisualizerCanvas;
