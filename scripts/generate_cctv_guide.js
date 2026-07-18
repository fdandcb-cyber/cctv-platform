const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  SectionType, TableOfContents, LevelFormat,
} = require("docx");
const fs = require("fs");
const path = require("path");

const IMG_DIR = "/home/z/my-project/download/cctv-guide-images";
const OUTPUT = "/home/z/my-project/download/CCTV_Security_Camera_Complete_Guide.docx";

const coverPalette = {
  bg: "162235", primary: "FFFFFF", accent: "37DCF2",
  cover: { titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078" },
  table: { headerBg: "1B6B7A", headerText: "FFFFFF", accentLine: "1B6B7A", innerLine: "C8DDE2", surface: "EDF3F5" },
};
const P = {
  primary: "0A1628", body: "1A2B40", secondary: "5B6B8A",
  accent: "1B6B7A", surface: "EDF3F5",
};
const c = (hex) => hex.replace("#", "");
const allNoBorders = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
  insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
};

function imgPara(filePath, maxWidth, caption) {
  const items = [];
  const buf = fs.readFileSync(filePath);
  let displayHeight = maxWidth;
  if (filePath.includes("connection_diagram") || filePath.includes("dvr_nvr")) {
    displayHeight = Math.round(maxWidth * (768 / 1344));
  }
  items.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 80 },
    children: [new ImageRun({
      data: buf, transformation: { width: maxWidth, height: displayHeight },
      type: "png",
    })],
  }));
  if (caption) {
    items.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: caption, size: 18, color: P.secondary, italics: true,
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
    }));
  }
  return items;
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, color: c(P.primary),
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, color: c(P.primary),
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}

function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312, after: 120 },
    children: [new TextRun({ text, size: 24, color: c(P.body),
      font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

function makeTable(headers, rows) {
  const borderStyle = {
    top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
    insideVertical: { style: BorderStyle.NONE },
  };
  const colW = Math.floor(100 / headers.length);
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map(h => new TableCell({
      width: { size: colW, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: h, bold: true, size: 21, color: "FFFFFF",
          font: { ascii: "Calibri", eastAsia: "SimHei" } })],
      })],
    })),
  });
  const dataRows = rows.map((row, idx) => new TableRow({
    cantSplit: true,
    children: row.map(cell => new TableCell({
      width: { size: colW, type: WidthType.PERCENTAGE },
      shading: idx % 2 === 0
        ? { type: ShadingType.CLEAR, fill: c(P.surface) }
        : { type: ShadingType.CLEAR, fill: "FFFFFF" },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({
        children: [new TextRun({ text: cell, size: 21, color: c(P.body),
          font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
      })],
    })),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: borderStyle,
    rows: [headerRow, ...dataRows],
  });
}

function calcTitleLayout(title, maxWidthTwips, preferredPt, minPt) {
  const charWidth = (pt) => pt * 20;
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    const cpl = charsPerLine(minPt);
    lines = splitTitleLines(title, cpl);
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const breakAfter = new Set([...' ,;:!?-', ...' ']);
  const lines = [];
  let remaining = title;
  while (remaining.length > charsPerLine) {
    let breakAt = -1;
    for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) {
        breakAt = i; break;
      }
    }
    if (breakAt === -1) {
      const limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (let i = charsPerLine + 1; i < limit; i++) {
        if (breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.substring(0, breakAt));
    remaining = remaining.substring(breakAt);
  }
  if (remaining.length > 0) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    lines[lines.length - 2] += " " + lines.pop();
  }
  return lines;
}

function calcCoverSpacing(params) {
  const { titleLineCount = 1, titlePt = 36, hasSubtitle = false, hasEnglishLabel = false, metaLineCount = 0, fixedHeight = 800 } = params;
  const SAFETY = 1200;
  const usableHeight = 16838 - SAFETY;
  const titleHeight = titleLineCount * (titlePt * 23 + 200);
  const subtitleHeight = hasSubtitle ? (12 * 23 + 600) : 0;
  const englishLabelHeight = hasEnglishLabel ? (9 * 23 + 600) : 0;
  const metaHeight = metaLineCount * (10 * 23 + 100);
  const implicitParaHeight = 3 * 300;
  const contentHeight = titleHeight + subtitleHeight + englishLabelHeight + metaHeight + fixedHeight + implicitParaHeight;
  const remainingSpace = Math.max(usableHeight - contentHeight, 400);
  const FOOTER_MIN = 800;
  const rawTop = Math.floor(remainingSpace * 0.45);
  const rawBottom = Math.floor(remainingSpace * 0.45);
  const bottomSpacing = Math.max(rawBottom, FOOTER_MIN);
  const topSpacing = Math.max(rawTop - Math.max(0, FOOTER_MIN - rawBottom), 400);
  return { topSpacing, bottomSpacing };
}

function buildCoverR1(config) {
  const CP = config.palette;
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 40, 24);
  const titleSize = titlePt * 2;
  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length, fixedHeight: 400,
  });
  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: CP.accent, space: 12 };
  const children = [];
  children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));
  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: CP.accent, space: 8 } },
      children: [new TextRun({ text: config.englishLabel.split("").join("  "),
        size: 18, color: CP.accent, font: { ascii: "Calibri", eastAsia: "SimHei" }, characterSpacing: 40 })],
    }));
  }
  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 100 : 300, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
      children: [new TextRun({ text: titleLines[i], size: titleSize, bold: true,
        color: CP.titleColor, font: { eastAsia: "SimHei", ascii: "Arial" } })],
    }));
  }
  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL }, spacing: { after: 800 },
      children: [new TextRun({ text: config.subtitle, size: 24, color: CP.subtitleColor,
        font: { eastAsia: "Microsoft YaHei", ascii: "Arial" } })],
    }));
  }
  for (const line of (config.metaLines || [])) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80 },
      border: { left: accentLeft },
      children: [new TextRun({ text: line, size: 24, color: CP.metaColor,
        font: { eastAsia: "Microsoft YaHei", ascii: "Arial" } })],
    }));
  }
  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));
  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: CP.accent, space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || "", size: 16, color: CP.footerColor, font: { ascii: "Arial" } }),
      new TextRun({ text: "                                        " }),
      new TextRun({ text: config.footerRight || "", size: 16, color: CP.footerColor, font: { ascii: "Arial" } }),
    ],
  }));
  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      verticalAlign: "top",
      children: [new TableCell({
        width: { size: 100, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: CP.bg },
        borders: allNoBorders,
        children: children,
      })],
    })],
  })];
}

function pageNumFooter(format) {
  const instrText = format === "roman" ? "PAGE \\* ROMAN \\* MERGEFORMAT" : "PAGE \\* arabic \\* MERGEFORMAT";
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080", font: { ascii: "Calibri" } })],
      instrText: [instrText],
    })],
  });
}

function listItem(ref, text) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

async function main() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 24, color: c(P.body) },
          paragraph: { spacing: { line: 312 } },
        },
        heading1: { run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 32, bold: true, color: c(P.primary) }, paragraph: { spacing: { before: 400, after: 200, line: 312 } } },
        heading2: { run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 28, bold: true, color: c(P.primary) }, paragraph: { spacing: { before: 300, after: 160, line: 312 } } },
        heading3: { run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 24, bold: true, color: c(P.primary) }, paragraph: { spacing: { before: 240, after: 120, line: 312 } } },
      },
    },
    numbering: {
      config: [
        { reference: "list-hik", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "Step %1:", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 500 } } } }] },
        { reference: "list-dah", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "Step %1:", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 500 } } } }] },
      ],
    },
    sections: [
      // Section 1: Cover
      {
        properties: {
          page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
        },
        children: buildCoverR1({
          title: "Complete Guide to Understanding CCTV Security Camera Systems",
          subtitle: "A Beginner-Friendly Research Guide for Homeowners",
          englishLabel: "SECURITY SYSTEMS",
          metaLines: [
            "Camera Types: Dome, Bullet, WiFi, PTZ, 4G",
            "Brands: Hikvision & Dahua with Budget Recommendations",
            "DVR vs NVR Compatibility Guide",
            "Mobile Viewing Setup Instructions",
          ],
          footerLeft: "CCTV Security Guide",
          footerRight: "July 2026",
          palette: coverPalette,
        }),
      },

      // Section 2: TOC
      {
        properties: {
          type: SectionType.NEXT_PAGE,
          page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
            pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN } },
        },
        footers: { default: pageNumFooter("roman") },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 360 },
            children: [new TextRun({ text: "Table of Contents", bold: true, size: 32, color: c(P.primary),
              font: { ascii: "Times New Roman", eastAsia: "SimHei" } })],
          }),
          new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({
              text: "Note: This Table of Contents is generated via field codes. To ensure page number accuracy after editing, please right-click the TOC and select \"Update Field.\"",
              italics: true, size: 18, color: "888888",
            })],
          }),
          new Paragraph({ children: [new PageBreak()] }),
        ],
      },

      // Section 3: Body
      {
        properties: {
          type: SectionType.NEXT_PAGE,
          page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
            pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
        },
        headers: {
          default: new Header({
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "Complete Guide to CCTV Security Camera Systems", size: 18, color: "808080", font: { ascii: "Calibri" } })],
            })],
          }),
        },
        footers: { default: pageNumFooter("arabic") },
        children: [

          // Executive Summary
          h1("Executive Summary"),
          body("This guide is designed for homeowners and general users who want to understand CCTV security camera systems from the ground up. Whether you are planning to install a security system for the first time or looking to upgrade your existing setup, this document walks you through every essential concept in simple, non-technical language. Security cameras are no longer luxury items reserved for businesses; they have become an affordable and practical solution for protecting homes, monitoring children and elderly family members, and deterring theft or vandalism."),
          body("The guide covers the five major camera types you will encounter in the market: Dome cameras, Bullet cameras, WiFi cameras, PTZ (Pan-Tilt-Zoom) cameras, and 4G cameras. Each type is explained with its physical appearance, ideal use case, advantages, and limitations. You will also learn about the two main recording systems, DVR (Digital Video Recorder) and NVR (Network Video Recorder), and how to determine which one is compatible with your chosen cameras. Two of the most popular and budget-friendly brands, Hikvision and Dahua, are covered in detail with specific model recommendations under 10,000 INR."),
          body("Additionally, this document provides step-by-step instructions for choosing the right CCTV setup based on your specific needs and budget, a complete walkthrough for viewing your cameras on a mobile phone, and practical tips for installation and maintenance. By the end of this guide, you will have the knowledge and confidence to select, purchase, and set up a CCTV system that perfectly matches your home security requirements without overspending."),

          // Chapter 1
          h1("Understanding Security Camera Systems"),
          body("A CCTV (Closed-Circuit Television) security system is a setup of cameras that capture video footage and transmit it to a recording device or cloud storage for monitoring and playback. Unlike broadcast television, CCTV footage is transmitted to a specific set of monitors or recorders, keeping the video feed private and secure. Modern CCTV systems have evolved significantly from the old analog systems that used bulky VHS tapes. Today, most systems use digital technology that provides high-definition video, remote viewing via smartphones, motion detection alerts, and night vision capabilities."),
          body("At its core, every CCTV system consists of three main components. First, the cameras themselves, which capture the video footage. Second, a recording device, either a DVR or an NVR, which stores the video for later viewing. Third, a display device, such as a monitor, television, or smartphone app, where you can watch the live or recorded footage. Understanding these three components is the foundation of making an informed purchase decision. Many beginners make the mistake of buying cameras without considering the recording device, only to find out later that the two are not compatible."),
          body("The most important thing to understand before buying any CCTV equipment is the difference between analog and IP (Internet Protocol) camera systems. Analog cameras, which include most dome and bullet cameras under 5,000 INR, typically connect to a DVR using coaxial cables (BNC connectors). IP cameras, which include most WiFi and high-end cameras, connect to an NVR using Ethernet cables or wirelessly. While you can sometimes mix these systems using converters, it is always simpler and more cost-effective to stick with one type. For most homeowners on a budget, an analog system with a DVR offers the best value for money."),

          // Chapter 2
          h1("Types of CCTV Cameras"),
          body("Understanding the different types of CCTV cameras available in the market is the most important step in choosing the right security system. Each camera type is designed for specific situations and environments. Some are better for indoor use, others for outdoor surveillance. Some offer wide-angle views, while others can zoom in on distant objects. In this chapter, we will examine each of the five major camera types in detail, helping you understand what they look like, how they work, and where they are best used."),

          h2("Dome Camera"),
          ...imgPara(path.join(IMG_DIR, "dome_camera.png"), 320, "Figure 1: Dome CCTV Camera"),
          body("The dome camera is named after its dome-shaped housing, which encloses the camera lens inside a protective plastic or glass cover. This design is one of the most recognizable and widely used camera types in the world. You will find dome cameras in almost every shopping mall, office building, hotel lobby, and an increasing number of homes. The dome shape serves two important purposes: it protects the camera from dust, rain, and physical tampering, and it conceals the direction the camera is pointing, which adds a psychological deterrent effect since potential intruders cannot tell if they are being watched."),
          body("Dome cameras are available in both indoor and outdoor variants. Indoor dome cameras are typically smaller, more discreet, and blend easily with ceiling designs. They are ideal for living rooms, hallways, and indoor entrances. Outdoor dome cameras, often called vandal-proof domes, are built with weather-resistant housing (IP66 or IP67 rating) and tougher enclosures that can withstand impacts. Most dome cameras offer a wide field of view, typically between 90 and 110 degrees, making them excellent for monitoring large open areas such as parking lots, gardens, and store floors."),
          body("For budget-conscious homeowners, dome cameras from Hikvision (such as the DS-2CE5AD0T-IRP or DS-2CD2143G2-I) and Dahua (such as the IPC-HDW2231T-AS or DH-IPC-HFW1230S) offer excellent value. Prices typically range from 1,500 to 4,000 INR per camera depending on the resolution (2MP to 4MP) and features. The key advantage of dome cameras for home users is their aesthetic appeal; they look modern and unobtrusive compared to the more industrial-looking bullet cameras."),

          h2("Bullet Camera"),
          ...imgPara(path.join(IMG_DIR, "bullet_camera.png"), 320, "Figure 2: Bullet CCTV Camera"),
          body("Bullet cameras are characterized by their long, cylindrical shape that resembles a bullet casing or a tube. Unlike dome cameras, bullet cameras have a visible lens that points in a specific direction, making it immediately obvious what area they are monitoring. This visibility can actually be an advantage in some situations, as the mere sight of a bullet camera can deter criminals from approaching your property. Bullet cameras are most commonly used outdoors, mounted on walls, fences, or under eaves, where their weather-resistant design and long-range capabilities shine."),
          body("The most significant advantage of bullet cameras is their extended viewing range. Many bullet cameras come with varifocal lenses that can zoom optically up to 4x or even 8x, allowing you to monitor distant areas such as driveways, farm gates, or long hallways. They also typically have more powerful infrared (IR) LEDs for night vision, with some models capable of seeing up to 30 to 50 meters in complete darkness. Additionally, bullet cameras are easier to install and adjust because their mounting brackets allow for precise aiming in any direction."),
          body("For homeowners, popular budget bullet camera models include the Hikvision DS-2CE56D0T-IRP (2MP, 20m IR) and the Dahua DH-HFW1200T1-A-IL (2MP, 30m IR). These typically cost between 1,200 and 3,500 INR per unit. Bullet cameras are the best choice when you need to monitor a specific narrow area from a distance, such as a front gate, a back alley, or a long driveway."),

          h2("WiFi Camera"),
          ...imgPara(path.join(IMG_DIR, "wifi_camera.png"), 320, "Figure 3: WiFi Wireless CCTV Camera"),
          body("WiFi cameras, also known as wireless IP cameras, represent the most user-friendly and rapidly growing segment of the CCTV market. Unlike traditional cameras that require cables for both power and data transmission, WiFi cameras connect to your home wireless network to transmit video footage, requiring only a power cable (or no cable at all if battery-powered). This makes them incredibly easy to install, as you can place them almost anywhere within range of your WiFi router without running long cables through walls or ceilings. For renters and apartment dwellers, WiFi cameras are often the only practical option."),
          body("WiFi cameras offer several features that are particularly appealing to home users. Most come with free mobile apps that allow you to view live footage, receive motion detection notifications, and even communicate through a built-in two-way audio system from anywhere in the world using your smartphone. Many models also offer cloud storage options, so even if the camera is damaged or stolen, the footage remains safe in the cloud. Popular features include person detection (using AI to distinguish between people and pets), automatic tracking (the camera follows movement), and integration with smart home systems like Amazon Alexa and Google Home."),
          body("Hikvision offers WiFi cameras under its Ezviz sub-brand, such as the C6N (pan and tilt, 2MP, around 2,500 INR) and the C2C (mini bullet, 1080p, around 2,000 INR). Dahua offers similar models through its Imou brand, such as the Ranger 2 (4MP, pan and tilt, around 3,500 INR). These cameras connect directly to your phone via the Ezviz or Imou app, making setup as simple as scanning a QR code. The main limitation of WiFi cameras is their dependence on a strong and stable WiFi signal."),

          h2("PTZ Camera"),
          ...imgPara(path.join(IMG_DIR, "ptz_camera.png"), 320, "Figure 4: PTZ (Pan-Tilt-Zoom) Camera"),
          body("PTZ stands for Pan, Tilt, and Zoom, which are the three motorized movements that set these cameras apart from all other types. A PTZ camera can rotate horizontally (pan) up to 360 degrees, move vertically (tilt) up to 90 degrees or more, and zoom in optically up to 20x, 30x, or even 40x depending on the model. This means a single PTZ camera can cover an enormous area and provide detailed close-up footage of distant objects, replacing the need for multiple fixed cameras. You can control these movements manually through a mobile app or NVR interface, or set up automatic patrol patterns and tracking rules."),
          body("PTZ cameras are primarily used in large outdoor areas where a single camera needs to monitor multiple zones. Common applications include large gardens, farm perimeters, parking lots, warehouses, and building entrances. When the camera detects motion in a specific area, it can automatically pan and zoom to follow the moving object, providing detailed footage that a fixed camera would miss. However, PTZ cameras have a significant limitation: they can only watch one direction at a time. If an incident occurs in a different zone while the camera is tracking something else, it will be missed."),
          body("PTZ cameras are generally more expensive than dome or bullet cameras, with budget models from Hikvision (DS-2DE4A425IWG-E, 4MP, 25x zoom, around 8,500 INR) and Dahua (SD49225T-HN, 2MP, 25x zoom, around 7,500 INR). For most homeowners with small to medium properties, a PTZ camera may be overkill. However, if you have a large property or need to monitor a wide area from a single vantage point, a PTZ camera offers unmatched flexibility and coverage."),

          h2("4G Camera"),
          ...imgPara(path.join(IMG_DIR, "4g_camera.png"), 320, "Figure 5: 4G LTE Solar-Powered Camera"),
          body("4G cameras are a specialized type of security camera that uses a 4G LTE mobile data connection (SIM card) instead of WiFi or Ethernet to transmit video footage. This makes them completely independent of any wired internet connection, which is a game-changer for locations where traditional internet is unavailable, unreliable, or impractical to install. Common use cases include remote farm houses, construction sites, parking lots, vacation homes, and any location where running an internet cable would be too expensive or physically impossible. Many 4G cameras also come with built-in solar panels, making them truly wireless as they do not need a power cable either."),
          body("The working principle of a 4G camera is straightforward: you insert an active 4G SIM card into the camera, and it connects to the mobile network just like your smartphone. The camera then streams live video to a cloud server or your mobile app over the 4G data connection. Most 4G cameras are designed to be highly energy-efficient, recording only when motion is detected to minimize data usage and battery consumption. A typical solar-powered 4G camera can operate continuously with just a few hours of sunlight per day, and the internal battery can last several days on a single charge even without sunlight."),
          body("Hikvision offers the DS-2XS6A47G0-F (4G solar camera, 4MP, around 12,000-15,000 INR) under its specialized product line. Dahua offers the IPC-HFW8242E-Z4E-4G (4G bullet camera, 4MP, around 10,000-13,000 INR). These prices are higher than WiFi or analog cameras, but they include the solar panel and built-in battery. The ongoing cost is the monthly 4G data plan, which typically costs 150-300 INR per month depending on your usage."),

          // Chapter 3
          h1("DVR vs NVR: Understanding Recording Systems"),
          ...imgPara(path.join(IMG_DIR, "dvr_nvr.png"), 440, "Figure 6: DVR and NVR Recording Devices"),
          body("One of the most confusing aspects of buying a CCTV system is understanding the difference between a DVR and an NVR, and knowing which one is compatible with your cameras. This chapter will clear up all the confusion with simple explanations and practical compatibility guidance."),

          h2("What is a DVR (Digital Video Recorder)?"),
          body("A DVR is a recording device designed to work with analog cameras. It processes and stores video footage from cameras that use coaxial cables (the round cables with BNC connectors) or RG59 cables. The DVR converts the analog video signal from each camera into a digital format and stores it on an internal hard disk drive (HDD). Most DVRs support 4, 8, or 16 camera channels, meaning you can connect that many cameras to a single device. DVRs are generally less expensive than NVRs and are compatible with the most affordable camera options on the market, making them the preferred choice for budget installations."),
          body("When you buy a DVR, you will need to purchase a separate internal hard disk drive (usually a 3.5-inch SATA HDD) for storage. A 1TB HDD can typically store about 2 to 4 weeks of continuous recording from 4 cameras at 1080p resolution. Common DVR brands include Hikvision (DS-72 series), Dahua (XVR5108 series), and budget options from CP Plus. DVRs typically offer features like motion detection recording (records only when movement is detected), scheduled recording, remote viewing via mobile app, and playback search by date and time."),

          h2("What is an NVR (Network Video Recorder)?"),
          body("An NVR is a recording device designed to work with IP (network) cameras. Unlike a DVR, which receives analog video signals through coaxial cables, an NVR receives digital video data through Ethernet cables (CAT5 or CAT6) or wirelessly via a WiFi network. The cameras and NVR communicate over a standard computer network, which means each camera essentially acts as a small computer with its own IP address. NVRs generally support higher resolutions (4MP, 5MP, even 4K/8MP) and offer more advanced features compared to DVRs."),
          body("NVRs from Hikvision (DS-76 series) and Dahua (NVR4208 series) are widely available and offer excellent value. Like DVRs, NVRs require a separate hard disk drive for storage, but because IP cameras produce larger file sizes due to higher resolutions, you may need a larger HDD (2TB or more) for the same recording duration. The main advantage of an NVR system is the superior video quality, easier setup with PoE (a single cable carries both power and data), and better remote access capabilities."),

          h2("Which Camera Supports Which Recorder?"),
          body("The golden rule of CCTV compatibility is straightforward: analog cameras work with DVRs, and IP cameras work with NVRs. You cannot directly connect an analog camera to an NVR, or an IP camera to a DVR. The table below summarizes the key compatibility information you need to know before making any purchase."),

          makeTable(
            ["Feature", "DVR System", "NVR System"],
            [
              ["Camera Type", "Analog / CVI / TVI / AHD", "IP (Network) cameras"],
              ["Cable Type", "Coaxial (BNC / RG59)", "Ethernet (CAT5 / CAT6)"],
              ["Power Delivery", "Separate power cable per camera", "PoE (single cable for data + power)"],
              ["Video Quality", "Up to 4MP (AHD/CVI/TVI)", "Up to 4K / 12MP"],
              ["Max Cable Length", "Up to 300m (with good cable)", "Up to 100m (per segment)"],
              ["Brand Examples", "Hikvision DS-72xx, Dahua XVR51xx", "Hikvision DS-76xx, Dahua NVR42xx"],
              ["Budget Range (4-ch)", "3,000 - 6,000 INR", "5,000 - 10,000 INR"],
              ["Best For", "Budget setups, simple installations", "High quality, PoE, smart features"],
            ]
          ),
          new Paragraph({ spacing: { before: 60, after: 200 }, alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Table 1: DVR vs NVR Compatibility Comparison", size: 18, color: P.secondary, italics: true, font: { ascii: "Calibri" } })] }),

          body("It is worth noting that Hikvision and Dahua have developed their own analog high-definition technologies. Hikvision uses HD-TVI (Turbo HD), while Dahua uses HD-CVI (Composite Video Interface). These are not compatible with each other at the chip level, so a Hikvision HD-TVI camera will not work with a Dahua HD-CVI DVR, and vice versa. When purchasing, always ensure that the camera and recorder are from the same brand and use the same technology. However, most modern DVRs from both brands are now hybrid or tri-brid, meaning they can accept analog, HD-TVI/HD-CVI, and even some IP cameras simultaneously."),

          // Chapter 4
          h1("How a CCTV System Connects Together"),
          ...imgPara(path.join(IMG_DIR, "connection_diagram.png"), 460, "Figure 7: CCTV System Connection Diagram"),
          body("Understanding how all the components of a CCTV system connect together is essential for both purchasing the right equipment and installing it correctly. The connection diagram above illustrates a typical NVR-based IP camera system, which is one of the most common setups for modern homes. The cameras connect to the NVR using Ethernet cables, and the NVR connects to your home router for internet access, enabling remote viewing on your smartphone. A monitor or television can be connected directly to the NVR for local viewing."),
          body("In a DVR-based system, the connection is slightly different. Each analog camera connects to the DVR using a coaxial cable (BNC connector) for video and a separate power cable for electricity. Some installations use a combination cable called a Siamese cable, which bundles the coaxial video cable and power cable together for easier installation. The DVR then connects to your router via an Ethernet cable for remote access. Whether you choose a DVR or NVR system, the connection to your router is the key that enables mobile viewing, email alerts, and cloud backup functionality."),

          // Chapter 5
          h1("How to View Your CCTV Cameras on Mobile"),
          ...imgPara(path.join(IMG_DIR, "mobile_app.png"), 320, "Figure 8: Mobile App Viewing CCTV Footage"),
          body("One of the most valuable features of a modern CCTV system is the ability to view your cameras from anywhere in the world using your smartphone. Whether you are at work, on vacation, or simply in another room, you can check on your home, your children, or your pets with just a few taps on your phone screen. This chapter provides step-by-step instructions for setting up mobile viewing for both DVR and NVR systems."),

          h2("For Hikvision Systems (iVMS-4500 App)"),
          listItem("list-hik", "Download the iVMS-4500 app from Google Play Store (Android) or Apple App Store (iOS). For WiFi cameras from the Ezviz brand, download the Ezviz app instead."),
          listItem("list-hik", "Open the app and tap the \"+\" icon in the top-right corner to add a new device. Select \"Register\" or \"Add Device\" depending on your app version."),
          listItem("list-hik", "You will need your DVR/NVR device serial number (found on the device label), the admin username (usually \"admin\" by default), and the admin password (set during initial device setup)."),
          listItem("list-hik", "The app will attempt to connect to your device through Hikvision's cloud servers (Hik-Connect). Ensure your DVR/NVR is connected to the internet via your router and that the Hik-Connect service is enabled in the device settings."),
          listItem("list-hik", "Once connected, you will see a list of your cameras. Tap any camera to view the live feed. You can also switch between cameras, take screenshots, record clips, and adjust camera settings from the app."),
          listItem("list-hik", "To enable motion push notifications, go to the app settings and enable \"Message Notification.\" You will receive instant alerts on your phone whenever motion is detected by any camera."),

          h2("For Dahua Systems (DMSS App)"),
          listItem("list-dah", "Download the DMSS app from Google Play Store or Apple App Store. For Imou-branded WiFi cameras, download the Imou Life app."),
          listItem("list-dah", "Create a DMSS account using your email or phone number. Then tap \"Add Device\" and scan the QR code on your DVR/NVR, or enter the device serial number manually."),
          listItem("list-dah", "Enter the device password (this is the admin password you set when first configuring the DVR/NVR). The app will connect through Dahua's DMSS cloud service."),
          listItem("list-dah", "After successful registration, your device will appear in the device list. Tap to open the live view. You can view up to 16 cameras simultaneously in a grid layout."),
          listItem("list-dah", "For WiFi cameras (Imou brand), simply connect the camera to power, open the Imou Life app, and follow the on-screen voice prompts to connect the camera to your WiFi network. The entire setup takes less than 3 minutes."),

          body("Important note for mobile viewing: your DVR/NVR must be connected to the internet through your home router at all times for remote viewing to work. If your internet connection goes down, you will not be able to view cameras remotely, but local recording and local monitor viewing will continue to function normally. For the most reliable remote access, use a wired Ethernet connection between the DVR/NVR and your router rather than WiFi, as this eliminates potential WiFi interference issues."),

          // Chapter 6
          h1("Popular CCTV Brands: Hikvision and Dahua"),
          body("Hikvision and Dahua are the two largest CCTV manufacturers in the world, collectively holding over 50% of the global security camera market. Both companies offer an incredibly wide range of products, from entry-level budget cameras to enterprise-grade professional systems. For homeowners, both brands offer excellent value, reliable quality, and strong after-sales support through their authorized dealer networks."),

          h2("Hikvision: Product Range and Models"),
          body("Hikvision is the world's largest manufacturer of video surveillance products, known for its Turbo HD analog technology (HD-TVI) and its comprehensive range of IP cameras, DVRs, and NVRs. For budget home users, Hikvision offers several excellent product lines. The ColorVu series (e.g., DS-2CE7AD0T-IRP) is particularly noteworthy because it provides full-color video even at night using large-aperture lenses and supplementary lighting, unlike traditional IR cameras that switch to black-and-white in low light. The DarkFighter series offers similar low-light performance in the IP camera range."),
          body("For a complete budget setup under 10,000 INR, Hikvision offers the DS-7104HI-K1 DVR (4-channel, approximately 3,500 INR without HDD) paired with DS-2CE56D0T-IRP bullet cameras (approximately 1,500 INR each). A 1TB surveillance-grade HDD costs approximately 3,000 INR. So a complete 2-camera system would cost approximately 9,500 INR including the HDD. Hikvision's mobile app (iVMS-4500 for DVR/NVR, Ezviz for WiFi cameras) is user-friendly and reliable."),

          h2("Dahua: Product Range and Models"),
          body("Dahua Technology is the second-largest CCTV manufacturer globally and is Hikvision's primary competitor. Dahua cameras use HD-CVI (High Definition Composite Video Interface) technology for their analog systems, which delivers similar performance to Hikvision's HD-TVI. Dahua is known for offering slightly better pricing than Hikvision in some product categories, making it a favorite among budget-conscious installers and homeowners. The Dahua Starlight series is well-regarded for its exceptional low-light performance."),
          body("For a budget setup under 10,000 INR, Dahua offers the XVR5108HS-4KL-I3 DVR (8-channel, 4K recording, approximately 4,000 INR without HDD) paired with DH-HFW1200T1-A-IL bullet cameras (approximately 1,200 INR each). With a 1TB HDD (approximately 3,000 INR), a complete 2-camera system would cost approximately 9,400 INR. Dahua's DMSS mobile app provides a clean interface for live viewing, playback, and push notifications. For WiFi cameras, the Imou sub-brand offers excellent options like the Imou Cruiser (outdoor bullet, 4MP, approximately 3,000 INR) and Imou Scout (indoor pan-tilt, 2MP, approximately 2,200 INR)."),

          h2("Brand Comparison Table"),
          makeTable(
            ["Feature", "Hikvision", "Dahua"],
            [
              ["Analog Technology", "HD-TVI (Turbo HD)", "HD-CVI"],
              ["Mobile App", "iVMS-4500 / Ezviz", "DMSS / Imou Life"],
              ["WiFi Camera Brand", "Ezviz", "Imou"],
              ["Color Night Vision", "ColorVu series", "Starlight / Full-Color series"],
              ["Budget DVR (4-ch)", "DS-7104HI-K1 (~3,500 INR)", "XVR5108HS (~4,000 INR)"],
              ["Budget Bullet Cam", "DS-2CE56D0T (~1,500 INR)", "DH-HFW1200T (~1,200 INR)"],
              ["Budget Dome Cam", "DS-2CE5AD0T (~1,800 INR)", "DH-IPC-HDW1230 (~1,400 INR)"],
              ["WiFi Pan-Tilt Cam", "Ezviz C6N (~2,500 INR)", "Imou Ranger 2 (~3,500 INR)"],
              ["NVR (4-ch, 4K)", "DS-7604NI-K1 (~5,500 INR)", "NVR4104HS (~5,000 INR)"],
              ["Global Market Share", "#1 worldwide (~38%)", "#2 worldwide (~15%)"],
            ]
          ),
          new Paragraph({ spacing: { before: 60, after: 200 }, alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Table 2: Hikvision vs Dahua Brand Comparison", size: 18, color: P.secondary, italics: true, font: { ascii: "Calibri" } })] }),

          // Chapter 7
          h1("Step-by-Step Guide to Choosing Your CCTV Setup"),
          body("Now that you understand the different camera types, recording systems, and brands, it is time to put this knowledge into practice. This chapter provides a practical, step-by-step framework for choosing the CCTV system that best fits your specific needs and budget."),

          h2("Step 1: Assess Your Security Needs"),
          body("Before spending any money, take a walk around your property and identify the areas that need surveillance. Common areas include the front gate or main entrance, the back door or rear entrance, the driveway or car parking area, the garden or backyard, and any ground-floor windows that are hidden from street view. For each area, note whether it is indoor or outdoor, whether it is covered or exposed to rain and sun, and the approximate distance from the camera mounting position to the area you want to monitor. This information will determine which camera type is best suited for each location."),

          h2("Step 2: Count the Number of Cameras Needed"),
          body("Based on your assessment in Step 1, determine the total number of cameras you need. For a typical small home or apartment, 2 to 4 cameras are usually sufficient to cover the main entry points. For a larger property with multiple access points, you may need 4 to 8 cameras. Remember that the number of cameras directly affects the cost of the DVR/NVR (which comes in 4, 8, 16, or 32-channel variants) and the hard disk storage capacity required. It is always better to buy a recorder with more channels than you currently need, so you can add cameras later without replacing the entire recorder."),

          h2("Step 3: Decide Between Wired and Wireless"),
          body("If you own your home and can run cables through walls and ceilings, a wired system (DVR + analog cameras or NVR + IP cameras) offers the most reliable performance and the best value for money. If you are renting, or if running cables is impractical, WiFi cameras are the way to go. For remote locations without internet, 4G cameras are the only option. Most homeowners will get the best results with a hybrid approach: wired cameras for the main exterior points (front gate, back door) and a WiFi camera or two for indoor monitoring."),

          h2("Step 4: Choose Your Budget Tier"),
          makeTable(
            ["Budget Tier", "Total Cost (INR)", "What You Get", "Recommended Setup"],
            [
              ["Basic", "3,000 - 5,000", "1-2 WiFi cameras with cloud storage", "2x Ezviz C2C or 2x Imou Scout WiFi cameras"],
              ["Standard", "5,000 - 8,000", "2 cameras + DVR + 1TB storage", "Hikvision DS-7104 + 2x DS-2CE56D0T + 1TB HDD"],
              ["Premium (Budget)", "8,000 - 10,000", "4 cameras + DVR/NVR + 2TB storage", "Dahua XVR5108 + 4x DH-HFW1200T + 2TB HDD"],
            ]
          ),
          new Paragraph({ spacing: { before: 60, after: 200 }, alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Table 3: Budget Tiers for CCTV Setup", size: 18, color: P.secondary, italics: true, font: { ascii: "Calibri" } })] }),

          h2("Step 5: Check Compatibility Before Buying"),
          body("This is the most critical step and the one where most beginners make expensive mistakes. Before purchasing any camera or recorder, verify the following compatibility points. First, ensure the camera technology matches the recorder: HD-TVI cameras only work with HD-TVI DVRs, and HD-CVI cameras only work with HD-CVI DVRs. Second, check that the camera resolution is supported by the recorder. A 4MP camera will not work properly with a DVR that only supports up to 2MP. Third, verify that the total number of cameras does not exceed the number of channels on the recorder. Finally, confirm that the mobile app associated with the recorder brand is available on your smartphone and supports the features you need (live view, playback, push notifications)."),

          h2("Step 6: Purchase and Install"),
          body("When purchasing CCTV equipment, always buy from authorized dealers or reputable online sellers to ensure you receive genuine products with valid warranties. Both Hikvision and Dahua have extensive dealer networks across India, and their products are also available on major e-commerce platforms. Beware of counterfeit products that may look identical but offer inferior quality and no warranty support. For installation, if you are comfortable with basic DIY tasks like drilling holes and running cables, you can install a wired system yourself using the mounting hardware and cables included with the cameras. WiFi cameras are even easier, typically requiring nothing more than a screw to mount the bracket and a power outlet. If you are not comfortable with DIY installation, most dealers offer professional installation services for an additional fee of 500 to 1,500 INR per camera."),

          // Chapter 8
          h1("Understanding Video Quality: Resolution and Frame Rate"),
          body("When evaluating CCTV cameras, you will encounter several technical specifications that directly affect the quality of the video footage. Understanding these specifications will help you make informed purchasing decisions and set realistic expectations for what your cameras can and cannot do. The two most important specifications are resolution (measured in megapixels or MP) and frame rate (measured in frames per second or FPS)."),
          body("Resolution refers to the number of pixels that make up the video image. Higher resolution means more detail and the ability to zoom in digitally without the image becoming pixelated. The most common resolutions in budget cameras are 1MP (720p, 1280x720 pixels), 2MP (1080p, 1920x1080 pixels), and 4MP (2560x1440 pixels). For home security, 2MP (1080p) is the minimum recommended resolution as it provides enough detail to clearly identify faces and license plates at short to medium distances (up to 10 meters). 4MP offers noticeably better detail and is worth the small additional cost if your budget allows."),
          body("Night vision capability is another critical factor. Most cameras use infrared (IR) LEDs to illuminate the scene in darkness, but IR footage is black-and-white and can sometimes lack detail. The newer ColorVu technology from Hikvision and similar full-color night vision from Dahua use a combination of large-aperture lenses, high-sensitivity sensors, and warm supplementary lighting to produce color footage even in very low light conditions. If identifying the color of a vehicle or clothing is important to you, consider spending a little extra for color night vision cameras."),

          // Chapter 9
          h1("Budget-Friendly Setup Recommendations"),
          body("Based on all the information presented in this guide, here are three recommended CCTV setups for different budgets, all under 10,000 INR. These recommendations prioritize value for money, reliability, and ease of use for first-time buyers."),

          h2("Setup 1: Ultra-Budget WiFi Only (Under 5,000 INR)"),
          body("This setup is ideal for renters, apartment dwellers, or anyone who wants the simplest possible installation with no cable running required. It consists of two WiFi pan-tilt cameras that you can control and view from your smartphone. The Hikvision Ezviz C6N (2MP, pan-tilt, built-in microphone, approximately 2,500 INR each) covers two rooms or entry points. You get free cloud storage for short clips (typically 7 days rolling), motion detection alerts, and two-way audio communication. Total cost: approximately 5,000 INR for two cameras. No DVR/NVR or cables needed. Simply download the Ezviz app, connect each camera to your WiFi, and you are ready to monitor your home from anywhere."),

          h2("Setup 2: Standard Wired System (5,000-8,000 INR)"),
          body("This is the most common setup for homeowners who want reliable 24/7 recording without depending on cloud subscriptions. It includes a 4-channel Hikvision DVR (DS-7104HI-K1, approximately 3,500 INR), two Hikvision Turbo HD bullet cameras (DS-2CE56D0T-IRP, 2MP, approximately 1,500 INR each), and a 1TB Seagate SkyHawk surveillance hard drive (approximately 3,000 INR). Total cost: approximately 9,500 INR. This system records continuously to the hard drive, providing about 2-3 weeks of recording history from two cameras. You can view live footage and playback recordings on your smartphone using the iVMS-4500 app."),

          h2("Setup 3: Best Value Under 10,000 INR"),
          body("For the best balance of coverage and cost, this setup includes a Dahua 8-channel DVR (XVR5108HS-4KL-I3, approximately 4,000 INR), four Dahua bullet cameras (DH-HFW1200T1-A-IL, 2MP, approximately 1,200 INR each), and a 2TB WD Purple surveillance hard drive (approximately 4,500 INR). Total cost: approximately 13,300 INR, which slightly exceeds the 10,000 INR budget but provides four times the camera coverage. If you need to stay strictly under 10,000 INR, reduce to two cameras and a 1TB HDD, bringing the total to approximately 9,400 INR. The 8-channel DVR gives you room to add up to four more cameras in the future without replacing the recorder."),

          // Chapter 10
          h1("Maintenance Tips for Long-Lasting Performance"),
          body("Once your CCTV system is installed and running, a few simple maintenance practices will ensure it continues to perform optimally for years to come. First, clean the camera lenses every 2 to 3 months using a soft microfiber cloth. Dust, rain spots, and spider webs can significantly degrade video quality, especially for outdoor cameras. Second, check all cable connections periodically to ensure they are tight and free from corrosion. Loose BNC connectors are the most common cause of signal loss or flickering in analog systems."),
          body("Third, review your hard drive storage capacity regularly and adjust the recording schedule or resolution if you find that the overwrite period is too short for your needs. Fourth, keep your DVR/NVR firmware updated. Both Hikvision and Dahua release regular firmware updates that fix security vulnerabilities, improve performance, and add new features. You can check for updates through the device's web interface or the mobile app. Fifth, if you are using WiFi cameras, ensure your router firmware is also up to date and consider assigning static IP addresses to your cameras to prevent connection issues after router reboots."),
          body("Finally, replace the backup battery in your DVR/NVR every 2 to 3 years to ensure that device settings are preserved during power outages. For outdoor cameras, inspect the cable entry points and seals at least twice a year, especially after heavy monsoon seasons, to ensure water has not seeped into the connections. By following these simple maintenance steps, your CCTV system will provide reliable security for 5 to 10 years or more, making it one of the best investments you can make for your home and family's safety."),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT, buffer);
  console.log("Document generated successfully:", OUTPUT);
}

main().catch(err => { console.error("Error:", err); process.exit(1); });