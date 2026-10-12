import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ROOM_TYPES, WALL_FINISHES, FLOORING_OPTIONS, HARDWARE_OPTIONS, FURNISHING_ADDONS, formatINR } from "@/lib/interiorData";
import { settingsService } from "@/services/settingsService";

/**
 * @param {Object} [options]
 * @param {string} [options.room]
 * @param {any} [options.dims]
 * @param {string} [options.wall]
 * @param {string} [options.floor]
 * @param {string} [options.hardware]
 * @param {any[]} [options.addons]
 * @param {any[]} [options.customItems]
 * @param {any} [options.estimate]
 * @param {any} [options.settings]
 */
export async function generateEstimatePDF({ room, dims, wall, floor, hardware, addons, customItems, estimate, settings = null } = {}) {
  let studioSettings = settings;
  if (!studioSettings) {
    try {
      studioSettings = await settingsService.getSettings();
    } catch {
      studioSettings = null;
    }
  }

  const showroomName = studioSettings?.showroomName || "Shree Mangalam Ply & Interiors";
  const address = studioSettings?.address || "Shop No. 06, Kusum Vihar 'A', Beside Banjara Hotel, Old Viva College Road, Virar West - 401303";
  const phone = studioSettings?.phone || "+91 87886 09224 / +91 98250 12345";
  const email = studioSettings?.email || "contact@mangalaminterior.in";

  const roomType = ROOM_TYPES.find((r) => r.id === room);
  const wallOpt = WALL_FINISHES.find((w) => w.id === wall);
  const floorOpt = FLOORING_OPTIONS.find((f) => f.id === floor);
  const hwOpt = HARDWARE_OPTIONS.find((h) => h.id === hardware);

  const floorArea = dims.length * dims.width;
  const wallArea = 2 * (dims.length + dims.width) * dims.height * 0.6;
  const ceilingArea = floorArea;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const validUntilStr = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const refNo = `SM-EST-${Math.floor(100000 + Math.random() * 900000)}`;

  // Create temporary container off-screen
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#0f172a";
  container.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.style.boxSizing = "border-box";
  container.style.padding = "0";

  // Build PDF HTML template
  const addonsSelected = (addons || []).map((id) => FURNISHING_ADDONS.find((a) => a.id === id)).filter(Boolean);
  const validCustoms = (customItems || []).filter((c) => c.name && c.qty > 0 && c.rate >= 0);

  container.innerHTML = `
    <div style="background: #ffffff; width: 800px; color: #0f172a; box-sizing: border-box;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 32px 36px; border-bottom: 4px solid #d97706;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; background: #d97706; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #0f172a; font-size: 18px;">
                M
              </div>
              <div>
                <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1.5px; color: #ffffff; text-transform: uppercase;">
                  ${showroomName}
                </h1>
                <p style="margin: 2px 0 0 0; font-size: 11px; tracking: 1px; color: #cbd5e1; text-transform: uppercase;">
                  Design Studio & Interior Retail
                </p>
              </div>
            </div>
            <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8; max-width: 380px;">
              Turnkey Interior Architecture · Modular Kitchens · Premium Furniture
            </p>
          </div>

          <div style="text-align: right;">
            <div style="display: inline-block; background: rgba(217, 119, 6, 0.2); border: 1px solid #d97706; color: #fbbf24; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 3px; letter-spacing: 1px; margin-bottom: 8px;">
              Estimates & Quotations
            </div>
            <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 600; color: #f8fafc;">
              Ref: <span style="font-family: monospace; color: #fbbf24;">${refNo}</span>
            </p>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #cbd5e1;">Date: ${dateStr}</p>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #94a3b8;">Valid Until: ${validUntilStr}</p>
          </div>
        </div>
      </div>

      <!-- Main Body Content -->
      <div style="padding: 32px 36px;">
        
        <!-- Room Specifications Summary Box -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-bottom: 28px;">
          <h2 style="margin: 0 0 14px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; tracking: 1.5px; color: #d97706;">
            Project Specifications
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 13px;">
            <div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed #e2e8f0;">
                <span style="color: #64748b;">Selected Room:</span>
                <strong style="color: #0f172a;">${roomType?.name || "N/A"}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed #e2e8f0;">
                <span style="color: #64748b;">Dimensions (L×W×H):</span>
                <strong style="color: #0f172a;">${dims.length} × ${dims.width} × ${dims.height} ft</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span style="color: #64748b;">Floor Area:</span>
                <strong style="color: #0f172a;">${floorArea.toFixed(0)} sq.ft</strong>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed #e2e8f0;">
                <span style="color: #64748b;">Wall Finish:</span>
                <strong style="color: #0f172a;">${wallOpt?.name || "Standard"}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed #e2e8f0;">
                <span style="color: #64748b;">Flooring Option:</span>
                <strong style="color: #0f172a;">${floorOpt?.name || "Standard"}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span style="color: #64748b;">Hardware Grade:</span>
                <strong style="color: #0f172a;">${hwOpt?.name || "Standard"}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Breakdown Table -->
        <h2 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #0f172a;">
          Itemized Estimate Breakdown
        </h2>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px;">
          <thead>
            <tr style="background: #0f172a; color: #ffffff; text-align: left;">
              <th style="padding: 10px 12px; border-radius: 4px 0 0 0; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; width: 30px;">#</th>
              <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Scope & Specifications</th>
              <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Coverage / Details</th>
              <th style="padding: 10px 12px; border-radius: 0 4px 0 0; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${estimate.breakdown.map((item, idx) => `
              <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 10px 12px; color: #64748b; font-weight: 500;">${idx + 1}</td>
                <td style="padding: 10px 12px; color: #0f172a; font-weight: 600;">${item.label}</td>
                <td style="padding: 10px 12px; color: #64748b; font-size: 11px;">Included in project scope</td>
                <td style="padding: 10px 12px; color: #0f172a; font-weight: 700; text-align: right;">${formatINR(item.value)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <!-- Grand Total Highlight Card -->
        <div style="background: #0f172a; color: #ffffff; border-left: 5px solid #d97706; border-radius: 6px; padding: 22px 28px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div>
            <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #d97706;">
              Grand Estimated Budget
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">
              Inclusive of Materials, Hardware, Execution & GST
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #fbbf24; font-weight: 600;">
              ≈ ${formatINR(estimate.perSqft)} / sq.ft
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 36px; font-weight: 800; color: #fbbf24; letter-spacing: -0.5px;">
              ${formatINR(estimate.total)}
            </div>
          </div>
        </div>

        <!-- Terms and Notes -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">
            Terms & Conditions
          </h3>
          <ul style="margin: 0; padding-left: 16px; font-size: 10px; color: #64748b; line-height: 1.6;">
            <li>This budget estimate is indicative and generated based on user-input dimensions and catalogue materials.</li>
            <li>Final quotation will be issued after physical site verification, structural assessment, and material selection at our showroom.</li>
            <li>Prices are subject to revision based on customization, brand choices, and actual site conditions.</li>
          </ul>
        </div>

        <!-- Footer Info & Signature Block -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 10px; color: #64748b;">
          <div>
            <strong style="color: #0f172a; font-size: 11px;">${showroomName}</strong><br />
            Showroom: ${address}<br />
            Contact: ${phone} | Email: ${email}
          </div>
          <div style="text-align: right;">
            <div style="border-bottom: 1px solid #94a3b8; width: 140px; margin-bottom: 4px; display: inline-block;"></div>
            <div>Authorized Signatory</div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Shree_Mangalam_Estimate_${roomType?.name?.replace(/\s+/g, "_") || "Room"}.pdf`);
  } catch (err) {
    console.error("PDF Export failed:", err);
    throw err;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
