export const manifest = {
  screens: {
    scr_lrskx5: { name: "Overview Dashboard", route: "/", position: { "x": 160, "y": 220 } },
    scr_qkhxn2: { name: "Order Management", route: "/orders", position: { "x": 1560, "y": 220 } },
    scr_f8kw3w: { name: "Dispatch & Live Map", route: "/dispatch", position: { "x": 2960, "y": 220 } },
    scr_7ny640: { name: "Transport & 3rd Party", route: "/transport", position: { "x": 5760, "y": 220 } },
    scr_9d3p4n: { name: "Riders & Runners", route: "/fleet", position: { "x": 4360, "y": 220 } },
    scr_1skqcm: { name: "Customers", route: "/customers", position: { "x": 160, "y": 2200 } },
    scr_xeplbg: { name: "Business Clients", route: "/business", position: { "x": 1560, "y": 2200 } },
    scr_5xqpqy: { name: "Pricing & Settings", route: "/pricing", position: { "x": 160, "y": 6160 } },
    scr_f0bu21: { name: "Payments & Finance", route: "/finance", position: { "x": 160, "y": 4180 } },
    scr_3rrqbu: { name: "Business Analytics", route: "/analytics", position: { "x": 1560, "y": 4180 } },
    scr_ycck2e: { name: "Communication Center", route: "/messages", position: { "x": 160, "y": 8140 } },
    scr_3r4br8: { name: "Customer Support", route: "/support", position: { "x": 1560, "y": 8140 } },
    scr_i02vtl: { name: "Platform Settings", route: "/settings", position: { "x": 1560, "y": 6160 } }
  },
  sections: {
    sec_qyk83m: { name: "Operations Pipeline", x: 0, y: 0, width: 7120, height: 1180 },
    sec_jso0kf: { name: "Customer Management", x: 0, y: 1980, width: 2920, height: 1180 },
    sec_jwfpe6: { name: "Financial & Analytics", x: 0, y: 3960, width: 2920, height: 1180 },
    sec_3ah29j: { name: "Configuration", x: 0, y: 5940, width: 2920, height: 1180 },
    sec_fu3lup: { name: "Support Operations", x: 0, y: 7920, width: 2920, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_qyk83m", children: [
    { kind: "screen", id: "scr_lrskx5" },
    { kind: "screen", id: "scr_qkhxn2" },
    { kind: "screen", id: "scr_f8kw3w" },
    { kind: "screen", id: "scr_9d3p4n" },
    { kind: "screen", id: "scr_7ny640" }]
  },
  { kind: "section", id: "sec_jso0kf", children: [
    { kind: "screen", id: "scr_1skqcm" },
    { kind: "screen", id: "scr_xeplbg" }]
  },
  { kind: "section", id: "sec_jwfpe6", children: [
    { kind: "screen", id: "scr_f0bu21" },
    { kind: "screen", id: "scr_3rrqbu" }]
  },
  { kind: "section", id: "sec_3ah29j", children: [
    { kind: "screen", id: "scr_5xqpqy" },
    { kind: "screen", id: "scr_i02vtl" }]
  },
  { kind: "section", id: "sec_fu3lup", children: [
    { kind: "screen", id: "scr_ycck2e" },
    { kind: "screen", id: "scr_3r4br8" }]
  }]

};