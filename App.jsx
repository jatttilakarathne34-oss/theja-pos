import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: 1, name: "Watalappan", category: "Traditional", price: 300, sku: "WAT001", stock: 50, status: "active", image: "🍮" },
  { id: 2, name: "Caramel Pudding", category: "Puddings", price: 250, sku: "PUD001", stock: 40, status: "active", image: "🍯" },
  { id: 3, name: "Chocolate Pudding", category: "Puddings", price: 280, sku: "PUD002", stock: 35, status: "active", image: "🍫" },
  { id: 4, name: "Buffalo Curd", category: "Curd", price: 180, sku: "CUR001", stock: 60, status: "active", image: "🥛" },
  { id: 5, name: "Coconut Curd", category: "Curd", price: 200, sku: "CUR002", stock: 45, status: "active", image: "🥥" },
  { id: 6, name: "Kavum", category: "Sweets", price: 150, sku: "SWT001", stock: 80, status: "active", image: "🍘" },
  { id: 7, name: "Kokis", category: "Sweets", price: 120, sku: "SWT002", stock: 100, status: "active", image: "🌸" },
  { id: 8, name: "Aluwa", category: "Sweets", price: 90, sku: "SWT003", stock: 70, status: "active", image: "🍬" },
  { id: 9, name: "Dodol", category: "Traditional", price: 200, sku: "TRD001", stock: 30, status: "active", image: "🟫" },
  { id: 10, name: "Milk Toffee", category: "Sweets", price: 60, sku: "SWT004", stock: 120, status: "active", image: "⬜" },
];

const INITIAL_USERS = [
  { id: 1, name: "Thejaa", phone: "0771234567", username: "Thejaa", password: "123", role: "admin", status: "active" },
  { id: 2, name: "Kasun Perera", phone: "0779876543", username: "kasun", password: "emp123", role: "employee", status: "active" },
  { id: 3, name: "Nimali Silva", phone: "0762345678", username: "nimali", password: "emp456", role: "employee", status: "active" },
];

const INITIAL_CREDITORS = [
  { id: 1, name: "Roshan Fernando", phone: "0701112222", address: "No 12, Galle Rd, Colombo", totalCredit: 4500, paid: 2000 },
  { id: 2, name: "Dilani Jayawardena", phone: "0713334444", address: "45, Kandy Rd, Kurunegala", totalCredit: 7200, paid: 5000 },
  { id: 3, name: "Suresh Kumara", phone: "0725556666", address: "Matara Town", totalCredit: 1800, paid: 0 },
];

const INITIAL_ORDERS = [
  { id: 1001, date: "2025-03-01", employee: "kasun", items: [{ name: "Watalappan", qty: 2, price: 300, discount: 50 }, { name: "Buffalo Curd", qty: 1, price: 180, discount: 0 }], total: 730, paymentType: "cash" },
  { id: 1002, date: "2025-03-02", employee: "nimali", items: [{ name: "Caramel Pudding", qty: 3, price: 250, discount: 0 }], total: 750, paymentType: "cash" },
  { id: 1003, date: "2025-03-03", employee: "kasun", items: [{ name: "Kavum", qty: 5, price: 150, discount: 20 }], total: 650, paymentType: "credit", creditor: "Roshan Fernando" },
  { id: 1004, date: "2025-03-04", employee: "nimali", items: [{ name: "Watalappan", qty: 1, price: 300, discount: 0 }, { name: "Kokis", qty: 2, price: 120, discount: 0 }], total: 540, paymentType: "cash" },
  { id: 1005, date: "2025-03-05", employee: "kasun", items: [{ name: "Chocolate Pudding", qty: 2, price: 280, discount: 30 }], total: 500, paymentType: "credit", creditor: "Dilani Jayawardena" },
];

const CATEGORIES = ["All", "Traditional", "Puddings", "Curd", "Sweets"];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --amber: #F59E0B;
    --amber-light: #FDE68A;
    --amber-dark: #B45309;
    --brown: #78350F;
    --cream: #FFFBEB;
    --cream2: #FEF3C7;
    --dark: #1C1917;
    --dark2: #292524;
    --dark3: #44403C;
    --mid: #78716C;
    --light: #D6D3D1;
    --white: #FAFAF9;
    --green: #16A34A;
    --red: #DC2626;
    --blue: #2563EB;
    --shadow: 0 4px 24px rgba(28,25,23,0.12);
    --shadow-lg: 0 8px 40px rgba(28,25,23,0.18);
    --radius: 16px;
    --radius-sm: 10px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--dark); color: var(--white); overflow-x: hidden; }
  
  h1,h2,h3,h4,h5 { font-family: 'Sora', sans-serif; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── LOGIN ── */
  .login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--dark) 0%, var(--dark2) 50%, #2D1B0A 100%);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    position: relative; overflow: hidden;
  }
  .login-page::before {
    content: ''; position: absolute; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%);
    top: -100px; right: -100px; border-radius: 50%;
  }
  .login-page::after {
    content: ''; position: absolute; width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%);
    bottom: 50px; left: -50px; border-radius: 50%;
  }
  .login-card {
    background: rgba(28,25,23,0.9);
    border: 1px solid rgba(245,158,11,0.2);
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%; max-width: 420px;
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-lg), 0 0 0 1px rgba(245,158,11,0.1);
    position: relative; z-index: 1;
  }
  .login-logo {
    text-align: center; margin-bottom: 32px;
  }
  .login-logo .logo-icon {
    width: 72px; height: 72px;
    background: linear-gradient(135deg, var(--amber), var(--amber-dark));
    border-radius: 20px; margin: 0 auto 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; box-shadow: 0 8px 24px rgba(245,158,11,0.4);
  }
  .login-logo h1 { font-size: 22px; color: var(--white); letter-spacing: -0.5px; }
  .login-logo p { color: var(--mid); font-size: 13px; margin-top: 4px; }
  
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--light); margin-bottom: 8px; letter-spacing: 0.3px; }
  .form-group input, .form-group select, .form-group textarea {
    width: 100%; padding: 14px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius-sm);
    color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 15px;
    transition: all 0.2s;
    outline: none;
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    border-color: var(--amber);
    background: rgba(245,158,11,0.05);
    box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
  }
  .form-group select option { background: var(--dark2); }
  .form-group textarea { resize: vertical; min-height: 80px; }

  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 24px; border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
    cursor: pointer; transition: all 0.2s; border: none; text-decoration: none;
    white-space: nowrap;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--amber), var(--amber-dark));
    color: var(--dark); box-shadow: 0 4px 16px rgba(245,158,11,0.35);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.45); }
  .btn-primary:active { transform: translateY(0); }
  .btn-secondary {
    background: rgba(255,255,255,0.08); color: var(--white);
    border: 1px solid rgba(255,255,255,0.12);
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.12); }
  .btn-danger { background: rgba(220,38,38,0.15); color: #FCA5A5; border: 1px solid rgba(220,38,38,0.3); }
  .btn-danger:hover { background: rgba(220,38,38,0.25); }
  .btn-success { background: rgba(22,163,74,0.15); color: #86EFAC; border: 1px solid rgba(22,163,74,0.3); }
  .btn-success:hover { background: rgba(22,163,74,0.25); }
  .btn-sm { padding: 8px 14px; font-size: 13px; }
  .btn-lg { padding: 18px 32px; font-size: 17px; }
  .btn-full { width: 100%; }
  .btn-icon { padding: 10px; }

  /* ── LAYOUT ── */
  .main-layout { display: flex; height: 100vh; overflow: hidden; }
  
  .sidebar {
    width: 240px; background: var(--dark2);
    border-right: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column;
    flex-shrink: 0; overflow-y: auto;
  }
  .sidebar-logo {
    padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 12px;
  }
  .sidebar-logo .s-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--amber), var(--amber-dark));
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .sidebar-logo .s-text h3 { font-size: 14px; color: var(--white); }
  .sidebar-logo .s-text p { font-size: 11px; color: var(--mid); margin-top: 2px; }
  
  .sidebar-nav { padding: 16px 12px; flex: 1; }
  .nav-section { margin-bottom: 8px; }
  .nav-section-label { font-size: 10px; font-weight: 700; color: var(--mid); letter-spacing: 1px; text-transform: uppercase; padding: 0 8px; margin-bottom: 6px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    cursor: pointer; transition: all 0.15s;
    color: var(--mid); font-size: 14px; font-weight: 500;
    margin-bottom: 2px;
  }
  .nav-item:hover { background: rgba(255,255,255,0.05); color: var(--white); }
  .nav-item.active { background: rgba(245,158,11,0.12); color: var(--amber); }
  .nav-item .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  
  .sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .user-info {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    background: rgba(255,255,255,0.04);
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, var(--amber), var(--amber-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: var(--dark); flex-shrink: 0;
  }
  .user-info .u-text { flex: 1; min-width: 0; }
  .user-info .u-name { font-size: 13px; font-weight: 600; color: var(--white); truncate: clip; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-info .u-role { font-size: 11px; color: var(--mid); }
  
  .content-area { flex: 1; overflow-y: auto; background: var(--dark); }
  
  .page-header {
    padding: 28px 32px 0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .page-header h2 { font-size: 24px; color: var(--white); }
  .page-header p { font-size: 13px; color: var(--mid); margin-top: 4px; }
  
  .page-content { padding: 24px 32px 32px; }

  /* ── CARDS ── */
  .card {
    background: var(--dark2);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: var(--radius);
    padding: 24px;
  }
  .card-sm { padding: 16px; }
  
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--dark2);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: var(--radius);
    padding: 20px 24px;
    position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--amber), var(--amber-dark));
  }
  .stat-card .s-label { font-size: 12px; color: var(--mid); font-weight: 500; letter-spacing: 0.3px; }
  .stat-card .s-value { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 700; color: var(--white); margin: 8px 0 4px; }
  .stat-card .s-sub { font-size: 12px; color: var(--green); }
  .stat-card .s-icon { position: absolute; top: 20px; right: 20px; font-size: 28px; opacity: 0.3; }

  /* ── TABLE ── */
  .table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.06); }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: rgba(255,255,255,0.03); }
  th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--mid); letter-spacing: 0.5px; text-transform: uppercase; white-space: nowrap; }
  td { padding: 14px 16px; font-size: 14px; color: var(--light); border-top: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
  tr:hover td { background: rgba(255,255,255,0.02); }
  
  .badge {
    display: inline-flex; align-items: center;
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
  }
  .badge-green { background: rgba(22,163,74,0.15); color: #86EFAC; }
  .badge-red { background: rgba(220,38,38,0.15); color: #FCA5A5; }
  .badge-amber { background: rgba(245,158,11,0.15); color: var(--amber); }
  .badge-blue { background: rgba(37,99,235,0.15); color: #93C5FD; }
  
  .avatar-sm {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--amber), var(--amber-dark));
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  /* ── SEARCH & FILTER ── */
  .search-row {
    display: flex; gap: 12px; align-items: center;
    margin-bottom: 20px; flex-wrap: wrap;
  }
  .search-wrap { flex: 1; min-width: 200px; position: relative; }
  .search-wrap input {
    width: 100%; padding: 12px 16px 12px 42px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius-sm);
    color: var(--white); font-size: 14px;
    outline: none;
  }
  .search-wrap input:focus { border-color: var(--amber); background: rgba(245,158,11,0.05); }
  .search-wrap .search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--mid); font-size: 16px; pointer-events: none;
  }
  .filter-btn {
    padding: 11px 16px; border-radius: var(--radius-sm);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--mid); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .filter-btn:hover { background: rgba(255,255,255,0.1); color: var(--white); }
  .filter-btn.active { background: rgba(245,158,11,0.12); border-color: var(--amber); color: var(--amber); }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 20px;
  }
  .modal {
    background: var(--dark2);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px; padding: 32px;
    width: 100%; max-width: 500px;
    box-shadow: var(--shadow-lg);
    max-height: 90vh; overflow-y: auto;
  }
  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .modal-header h3 { font-size: 18px; color: var(--white); }
  .modal-close {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(255,255,255,0.08);
    border: none; cursor: pointer; color: var(--mid);
    font-size: 18px; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .modal-close:hover { background: rgba(220,38,38,0.2); color: #FCA5A5; }
  .modal-footer { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }

  /* ── POS MOBILE ── */
  .pos-layout { display: flex; height: 100vh; overflow: hidden; }
  .pos-products {
    flex: 1; overflow-y: auto; background: var(--dark);
    display: flex; flex-direction: column;
  }
  .pos-header {
    padding: 16px; background: var(--dark2);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: sticky; top: 0; z-index: 10;
  }
  .pos-header h1 { font-size: 18px; color: var(--white); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .pos-header h1 span { font-size: 20px; }
  
  .cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
  .cat-scroll::-webkit-scrollbar { display: none; }
  .cat-btn {
    padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;
    border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
    color: var(--mid); cursor: pointer; white-space: nowrap; transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .cat-btn.active { background: var(--amber); border-color: var(--amber); color: var(--dark); }
  
  .products-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px; padding: 16px;
  }
  .product-card {
    background: var(--dark2);
    border: 2px solid rgba(255,255,255,0.06);
    border-radius: var(--radius);
    padding: 16px 12px; text-align: center;
    cursor: pointer; transition: all 0.15s;
    user-select: none;
  }
  .product-card:hover { border-color: rgba(245,158,11,0.4); transform: translateY(-2px); }
  .product-card:active { transform: scale(0.97); }
  .product-card.added { border-color: var(--amber); background: rgba(245,158,11,0.06); }
  .product-card .p-emoji { font-size: 36px; margin-bottom: 10px; display: block; }
  .product-card .p-name { font-size: 13px; font-weight: 600; color: var(--white); line-height: 1.3; margin-bottom: 6px; }
  .product-card .p-price { font-size: 14px; font-weight: 700; color: var(--amber); }
  .product-card .p-qty-badge {
    position: absolute; top: -6px; right: -6px;
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--amber); color: var(--dark);
    font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .product-card { position: relative; }
  
  .pos-cart {
    width: 340px; background: var(--dark2);
    border-left: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column;
    flex-shrink: 0;
  }
  .cart-header {
    padding: 20px 16px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cart-header h2 { font-size: 16px; color: var(--white); display: flex; align-items: center; justify-content: space-between; }
  .cart-count { background: var(--amber); color: var(--dark); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
  
  .cart-items { flex: 1; overflow-y: auto; padding: 12px 16px; }
  .cart-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: var(--mid); padding: 40px;
  }
  .cart-empty .e-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.4; }
  .cart-empty p { font-size: 14px; }
  
  .cart-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: var(--radius-sm);
    padding: 12px; margin-bottom: 8px;
  }
  .cart-item-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .cart-item-name { font-size: 14px; font-weight: 600; color: var(--white); }
  .cart-item-remove { background: none; border: none; color: var(--mid); cursor: pointer; font-size: 16px; padding: 2px 6px; border-radius: 4px; transition: all 0.15s; }
  .cart-item-remove:hover { background: rgba(220,38,38,0.2); color: #FCA5A5; }
  .cart-item-bottom { display: flex; align-items: center; justify-content: space-between; }
  .qty-control { display: flex; align-items: center; gap: 8px; }
  .qty-btn {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(255,255,255,0.08); border: none;
    color: var(--white); font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; font-weight: 700;
  }
  .qty-btn:hover { background: rgba(245,158,11,0.2); color: var(--amber); }
  .qty-num { font-size: 15px; font-weight: 700; color: var(--white); min-width: 20px; text-align: center; }
  .cart-item-price { font-size: 14px; font-weight: 700; color: var(--amber); }
  .discount-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
  .discount-row input {
    flex: 1; padding: 5px 10px; font-size: 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px; color: var(--white);
    outline: none; font-family: 'DM Sans', sans-serif;
  }
  .discount-row select {
    padding: 5px 8px; font-size: 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px; color: var(--white);
    outline: none; font-family: 'DM Sans', sans-serif;
  }
  .discount-row select option { background: var(--dark2); }
  
  .cart-footer {
    padding: 16px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .total-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .total-row span { font-size: 13px; color: var(--mid); }
  .total-row .t-val { font-size: 13px; color: var(--light); }
  .grand-total { display: flex; justify-content: space-between; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 8px; margin-bottom: 16px; }
  .grand-total span { font-size: 16px; font-weight: 700; color: var(--white); }
  .grand-total .g-val { font-size: 20px; font-weight: 800; color: var(--amber); font-family: 'Sora', sans-serif; }

  .payment-opts { display: flex; gap: 8px; margin-bottom: 12px; }
  .pay-opt {
    flex: 1; padding: 10px; border-radius: var(--radius-sm);
    border: 2px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: var(--mid); font-size: 13px; font-weight: 600;
    cursor: pointer; text-align: center; transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .pay-opt.active { border-color: var(--amber); background: rgba(245,158,11,0.1); color: var(--amber); }

  /* ── RECEIPT ── */
  .receipt {
    background: white; color: #111; font-family: 'Courier New', monospace;
    padding: 20px; max-width: 300px; margin: 0 auto;
    font-size: 13px; line-height: 1.6;
  }
  .receipt-title { text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 4px; }
  .receipt-sub { text-align: center; font-size: 11px; color: #555; margin-bottom: 12px; }
  .receipt-divider { border-top: 1px dashed #999; margin: 8px 0; }
  .receipt-row { display: flex; justify-content: space-between; }
  .receipt-total { display: flex; justify-content: space-between; font-weight: bold; font-size: 15px; }
  
  /* ── TOAST ── */
  .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; }
  .toast {
    padding: 12px 20px; border-radius: var(--radius-sm);
    font-size: 14px; font-weight: 500;
    animation: slideUp 0.3s ease;
    box-shadow: var(--shadow);
  }
  .toast-success { background: #15803D; color: white; }
  .toast-error { background: #B91C1C; color: white; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

  /* ── DIVIDER ── */
  .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 20px 0; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .pos-cart { width: 100%; max-width: none; }
    .pos-layout { flex-direction: column; }
    .pos-products { overflow-y: visible; }
    .products-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 10px; }
    .product-card { padding: 10px 8px; }
    .product-card .p-emoji { font-size: 28px; }
    .page-content { padding: 16px; }
    .page-header { padding: 20px 16px 0; }
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .empty-state {
    text-align: center; padding: 60px 20px; color: var(--mid);
  }
  .empty-state .e-icon { font-size: 56px; margin-bottom: 16px; opacity: 0.3; }
  .empty-state h3 { font-size: 18px; color: var(--light); margin-bottom: 8px; }
  .empty-state p { font-size: 14px; }
  
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } }
  
  .print-only { display: none; }
  @media print { .no-print { display: none !important; } .print-only { display: block; } body { background: white; } }
  
  .tag { display: inline-flex; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: rgba(245,158,11,0.15); color: var(--amber); }

  .progress-bar-wrap { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, var(--amber), var(--amber-dark)); border-radius: 3px; transition: width 0.5s; }

  .chart-bar-wrap { display: flex; flex-direction: column; gap: 10px; }
  .chart-row { display: flex; align-items: center; gap: 12px; }
  .chart-label { font-size: 13px; color: var(--light); width: 120px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chart-bar-bg { flex: 1; height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; }
  .chart-fill { height: 100%; background: linear-gradient(90deg, var(--amber), #D97706); border-radius: 4px; }
  .chart-val { font-size: 12px; color: var(--mid); width: 60px; text-align: right; flex-shrink: 0; }

  .creditor-balance { font-size: 16px; font-weight: 700; font-family: 'Sora', sans-serif; }
  .balance-outstanding { color: #FCA5A5; }
  .balance-paid { color: #86EFAC; }

  .mobile-bottom-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--dark2); border-top: 1px solid rgba(255,255,255,0.08);
    padding: 8px 0 16px; z-index: 100;
  }
  @media (max-width: 768px) { .mobile-bottom-nav { display: flex; } }
  .mob-nav-item {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 8px; cursor: pointer; transition: all 0.15s;
    color: var(--mid); font-size: 10px; font-weight: 600;
  }
  .mob-nav-item .m-icon { font-size: 20px; }
  .mob-nav-item.active { color: var(--amber); }
`;

// ─── TOAST ───────────────────────────────────────────────────────────────────
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ users, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) { setError("Invalid username or password"); return; }
    if (user.status !== "active") { setError("Account is inactive. Contact admin."); return; }
    onLogin(user);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🍮</div>
          <h1>Theja Food Product</h1>
          <p>Point of Sale System</p>
        </div>
        <div className="form-group">
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        {error && <div style={{ color: "#FCA5A5", fontSize: 13, marginBottom: 16, padding: "10px 14px", background: "rgba(220,38,38,0.1)", borderRadius: 8 }}>{error}</div>}
        <button className="btn btn-primary btn-full btn-lg" onClick={handleLogin}>Login →</button>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--mid)", marginTop: 20 }}>
          Demo: Thejaa/123 · kasun/emp123
        </p>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ orders, products, creditors, users }) {
  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter(o => o.date === today || true); // show all for demo
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const cashRevenue = orders.filter(o => o.paymentType === "cash").reduce((s, o) => s + o.total, 0);
  const creditRevenue = orders.filter(o => o.paymentType === "credit").reduce((s, o) => s + o.total, 0);
  const totalCredit = creditors.reduce((s, c) => s + (c.totalCredit - c.paid), 0);

  const productSales = {};
  orders.forEach(o => o.items.forEach(i => {
    productSales[i.name] = (productSales[i.name] || 0) + i.qty;
  }));
  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSale = topProducts[0]?.[1] || 1;

  const empSales = {};
  orders.forEach(o => { empSales[o.employee] = (empSales[o.employee] || 0) + o.total; });

  return (
    <div>
      <div className="page-header">
        <div><h2>Dashboard</h2><p>Welcome back! Here's your business overview.</p></div>
      </div>
      <div className="page-content">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="s-icon">💰</div>
            <div className="s-label">TOTAL REVENUE</div>
            <div className="s-value">Rs {totalRevenue.toLocaleString()}</div>
            <div className="s-sub">↑ All time</div>
          </div>
          <div className="stat-card">
            <div className="s-icon">🧾</div>
            <div className="s-label">TOTAL ORDERS</div>
            <div className="s-value">{orders.length}</div>
            <div className="s-sub">{orders.filter(o => o.paymentType === "cash").length} cash orders</div>
          </div>
          <div className="stat-card">
            <div className="s-icon">💳</div>
            <div className="s-label">OUTSTANDING CREDIT</div>
            <div className="s-value" style={{ color: "#FCA5A5" }}>Rs {totalCredit.toLocaleString()}</div>
            <div className="s-sub">{creditors.length} creditors</div>
          </div>
          <div className="stat-card">
            <div className="s-icon">📦</div>
            <div className="s-label">PRODUCTS</div>
            <div className="s-value">{products.filter(p => p.status === "active").length}</div>
            <div className="s-sub">{products.length} total</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <h3 style={{ marginBottom: 20, fontSize: 15 }}>🏆 Top Selling Products</h3>
            <div className="chart-bar-wrap">
              {topProducts.map(([name, qty]) => (
                <div className="chart-row" key={name}>
                  <div className="chart-label">{name}</div>
                  <div className="chart-bar-bg"><div className="chart-fill" style={{ width: `${(qty / maxSale) * 100}%` }} /></div>
                  <div className="chart-val">{qty} sold</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 20, fontSize: 15 }}>👤 Sales by Employee</h3>
            {Object.entries(empSales).map(([emp, total]) => (
              <div key={emp} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{emp[0].toUpperCase()}</div>
                  <span style={{ fontSize: 14, color: "var(--light)" }}>{emp}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--amber)" }}>Rs {total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 16, fontSize: 15 }}>📋 Recent Orders</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Bill #</th><th>Date</th><th>Employee</th><th>Items</th><th>Payment</th><th>Total</th></tr></thead>
              <tbody>
                {[...orders].reverse().slice(0, 5).map(o => (
                  <tr key={o.id}>
                    <td><span style={{ fontFamily: "monospace", color: "var(--amber)" }}>#{o.id}</span></td>
                    <td>{o.date}</td>
                    <td>{o.employee}</td>
                    <td>{o.items.length} item(s)</td>
                    <td><span className={`badge ${o.paymentType === "cash" ? "badge-green" : "badge-amber"}`}>{o.paymentType}</span></td>
                    <td style={{ fontWeight: 700, color: "var(--white)" }}>Rs {o.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
function ProductsPage({ products, setProducts, addToast }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Traditional", price: "", sku: "", stock: "", status: "active", image: "🍮" });

  const filtered = products.filter(p =>
    (catFilter === "All" || p.category === catFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setEditItem(null); setForm({ name: "", category: "Traditional", price: "", sku: "", stock: "", status: "active", image: "🍮" }); setShowModal(true); };
  const openEdit = (p) => { setEditItem(p); setForm({ ...p, price: String(p.price), stock: String(p.stock) }); setShowModal(true); };

  const save = () => {
    if (!form.name || !form.price) { addToast("error", "Name and price required"); return; }
    if (editItem) {
      setProducts(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) } : p));
      addToast("success", "Product updated");
    } else {
      setProducts(prev => [...prev, { ...form, id: Date.now(), price: Number(form.price), stock: Number(form.stock) }]);
      addToast("success", "Product added");
    }
    setShowModal(false);
  };

  const del = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); addToast("success", "Product deleted"); };
  const toggle = (id) => { setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p)); };

  const EMOJIS = ["🍮", "🍯", "🍫", "🥛", "🥥", "🍘", "🌸", "🍬", "🟫", "⬜", "🍩", "🎂", "🍰", "🧁", "🍭"];

  return (
    <div>
      <div className="page-header">
        <div><h2>Products</h2><p>{products.length} products in catalog</p></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>
      <div className="page-content">
        <div className="search-row">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {CATEGORIES.map(c => <button key={c} className={`filter-btn ${catFilter === c ? "active" : ""}`} onClick={() => setCatFilter(c)}>{c}</button>)}
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="avatar-sm">{p.image}</div>
                      <span style={{ fontWeight: 600, color: "var(--white)" }}>{p.name}</span>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--mid)" }}>{p.sku}</span></td>
                  <td><span className="tag">{p.category}</span></td>
                  <td style={{ fontWeight: 700, color: "var(--amber)" }}>Rs {p.price}</td>
                  <td>{p.stock}</td>
                  <td><span className={`badge ${p.status === "active" ? "badge-green" : "badge-red"}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                      <button className="btn btn-sm" style={{ background: p.status === "active" ? "rgba(220,38,38,0.1)" : "rgba(22,163,74,0.1)", color: p.status === "active" ? "#FCA5A5" : "#86EFAC", border: "none" }} onClick={() => toggle(p.id)}>{p.status === "active" ? "Deactivate" : "Activate"}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><div className="e-icon">📦</div><h3>No products found</h3><p>Try changing your search or filter.</p></div>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editItem ? "Edit Product" : "Add New Product"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--light)", marginBottom: 8 }}>Icon</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm(f => ({ ...f, image: e }))} style={{ width: 42, height: 42, fontSize: 22, background: form.image === e ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)", border: form.image === e ? "2px solid var(--amber)" : "2px solid transparent", borderRadius: 10, cursor: "pointer" }}>{e}</button>
                ))}
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Product Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Watalappan" /></div>
              <div className="form-group"><label>SKU / Code</label><input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="e.g. WAT001" /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>{CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}</select></div>
              <div className="form-group"><label>Status</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Price (Rs) *</label><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" /></div>
              <div className="form-group"><label>Stock Qty</label><input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editItem ? "Save Changes" : "Add Product"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── POS BILLING ──────────────────────────────────────────────────────────────
function POSPage({ products, currentUser, creditors, orders, setOrders, addToast }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [cart, setCart] = useState([]);
  const [paymentType, setPaymentType] = useState("cash");
  const [selectedCreditor, setSelectedCreditor] = useState("");
  const [showReceipt, setShowReceipt] = useState(null);
  const [showCart, setShowCart] = useState(false);

  const filtered = products.filter(p =>
    p.status === "active" &&
    (catFilter === "All" || p.category === catFilter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1, discount: 0, discountType: "fixed" }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i);
      return updated;
    });
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const updateDiscount = (id, val, type) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, discount: Number(val) || 0, discountType: type || i.discountType } : i));
  };

  const getItemTotal = (item) => {
    const base = item.price * item.qty;
    const disc = item.discountType === "percent" ? (base * item.discount / 100) : item.discount * item.qty;
    return Math.max(0, base - disc);
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalDiscount = cart.reduce((s, i) => s + (i.price * i.qty - getItemTotal(i)), 0);
  const grandTotal = subtotal - totalDiscount;

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const checkout = () => {
    if (cart.length === 0) { addToast("error", "Cart is empty"); return; }
    if (paymentType === "credit" && !selectedCreditor) { addToast("error", "Select a creditor"); return; }
    const newOrder = {
      id: 1000 + orders.length + 1,
      date: new Date().toISOString().split("T")[0],
      employee: currentUser.username,
      items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price, discount: i.discount, discountType: i.discountType, total: getItemTotal(i) })),
      total: grandTotal,
      paymentType,
      creditor: selectedCreditor || null,
    };
    setOrders(prev => [...prev, newOrder]);
    setShowReceipt(newOrder);
    setCart([]);
    setPaymentType("cash");
    setSelectedCreditor("");
    setShowCart(false);
    addToast("success", `Bill #${newOrder.id} created!`);
  };

  return (
    <div className="pos-layout">
      {/* Products Side */}
      <div className="pos-products">
        <div className="pos-header">
          <h1><span>🍮</span> Theja Food Product — POS</h1>
          <div className="search-wrap" style={{ marginBottom: 12 }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
          </div>
          <div className="cat-scroll">
            {CATEGORIES.map(c => <button key={c} className={`cat-btn ${catFilter === c ? "active" : ""}`} onClick={() => setCatFilter(c)}>{c}</button>)}
          </div>
        </div>
        <div className="products-grid">
          {filtered.map(p => {
            const inCart = cart.find(i => i.id === p.id);
            return (
              <div key={p.id} className={`product-card ${inCart ? "added" : ""}`} onClick={() => addToCart(p)}>
                {inCart && <div className="p-qty-badge">{inCart.qty}</div>}
                <span className="p-emoji">{p.image}</span>
                <div className="p-name">{p.name}</div>
                <div className="p-price">Rs {p.price}</div>
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "var(--mid)" }}>No products found</div>}
        </div>
      </div>

      {/* Cart Side - Desktop */}
      <div className="pos-cart no-print" style={{ display: window.innerWidth > 768 ? "flex" : showCart ? "flex" : "none" }}>
        <div className="cart-header">
          <h2>Cart <span className="cart-count">{cartCount}</span></h2>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="e-icon">🛒</div>
            <p>Cart is empty</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Tap products to add</p>
          </div>
        ) : (
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-top">
                  <span className="cart-item-name">{item.image} {item.name}</span>
                  <button className="cart-item-remove" onClick={() => removeItem(item.id)}>×</button>
                </div>
                <div className="cart-item-bottom">
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                  <div className="cart-item-price">Rs {getItemTotal(item).toLocaleString()}</div>
                </div>
                <div className="discount-row">
                  <input
                    type="number" placeholder="Discount"
                    value={item.discount || ""}
                    onChange={e => updateDiscount(item.id, e.target.value, item.discountType)}
                    style={{ width: 80 }}
                  />
                  <select value={item.discountType} onChange={e => updateDiscount(item.id, item.discount, e.target.value)}>
                    <option value="fixed">Rs</option>
                    <option value="percent">%</option>
                  </select>
                  {item.discount > 0 && <span style={{ fontSize: 11, color: "#86EFAC" }}>-Rs {(item.price * item.qty - getItemTotal(item)).toFixed(0)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-footer">
          <div className="total-row"><span>Subtotal</span><span className="t-val">Rs {subtotal.toLocaleString()}</span></div>
          {totalDiscount > 0 && <div className="total-row"><span>Discount</span><span style={{ color: "#86EFAC" }}>-Rs {totalDiscount.toFixed(0)}</span></div>}
          <div className="grand-total"><span>Total</span><span className="g-val">Rs {grandTotal.toLocaleString()}</span></div>

          <div className="payment-opts">
            <button className={`pay-opt ${paymentType === "cash" ? "active" : ""}`} onClick={() => setPaymentType("cash")}>💵 Cash</button>
            <button className={`pay-opt ${paymentType === "credit" ? "active" : ""}`} onClick={() => setPaymentType("credit")}>📋 Credit</button>
          </div>

          {paymentType === "credit" && (
            <div className="form-group" style={{ marginBottom: 12 }}>
              <select value={selectedCreditor} onChange={e => setSelectedCreditor(e.target.value)} style={{ padding: "10px 12px" }}>
                <option value="">Select creditor…</option>
                {creditors.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          )}

          <button className="btn btn-primary btn-full btn-lg" onClick={checkout} disabled={cart.length === 0}>
            Checkout — Rs {grandTotal.toLocaleString()}
          </button>
        </div>
      </div>

      {/* Mobile Cart Toggle */}
      {cart.length > 0 && (
        <button className="btn btn-primary" style={{ display: window.innerWidth <= 768 ? "flex" : "none", position: "fixed", bottom: 80, right: 16, zIndex: 50, borderRadius: 50, width: 64, height: 64, fontSize: 20 }} onClick={() => setShowCart(s => !s)}>
          🛒{cartCount > 0 && <span style={{ position: "absolute", top: 8, right: 8, background: "var(--dark)", color: "var(--amber)", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
        </button>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 360 }}>
            <div className="modal-header">
              <h3>🧾 Bill Generated!</h3>
              <button className="modal-close" onClick={() => setShowReceipt(null)}>×</button>
            </div>
            <div className="receipt">
              <div className="receipt-title">Theja Food Product</div>
              <div className="receipt-sub">Sri Lankan Desserts & Sweets</div>
              <div className="receipt-sub">📞 +94 71 XXX XXXX</div>
              <div className="receipt-divider" />
              <div className="receipt-row"><span>Bill #</span><span>{showReceipt.id}</span></div>
              <div className="receipt-row"><span>Date</span><span>{showReceipt.date}</span></div>
              <div className="receipt-row"><span>Time</span><span>{new Date().toLocaleTimeString()}</span></div>
              <div className="receipt-row"><span>Cashier</span><span>{showReceipt.employee}</span></div>
              <div className="receipt-row"><span>Payment</span><span>{showReceipt.paymentType.toUpperCase()}</span></div>
              {showReceipt.creditor && <div className="receipt-row"><span>Creditor</span><span>{showReceipt.creditor}</span></div>}
              <div className="receipt-divider" />
              <div style={{ fontSize: 11, marginBottom: 6 }}>ITEM                     QTY  PRICE</div>
              {showReceipt.items.map((item, i) => (
                <div key={i}>
                  <div className="receipt-row" style={{ fontSize: 12 }}>
                    <span>{item.name}</span>
                    <span>{item.qty} × Rs{item.price}</span>
                  </div>
                  {item.discount > 0 && <div style={{ fontSize: 11, color: "#666", textAlign: "right" }}>Discount: -Rs{item.discount * item.qty}</div>}
                </div>
              ))}
              <div className="receipt-divider" />
              <div className="receipt-total"><span>TOTAL</span><span>Rs {showReceipt.total.toLocaleString()}</span></div>
              <div className="receipt-divider" />
              <div style={{ textAlign: "center", fontSize: 11, color: "#555", marginTop: 8 }}>Thank you for your purchase!<br />Please come again 🙏</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowReceipt(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>🖨 Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CREDITORS ────────────────────────────────────────────────────────────────
function CreditorsPage({ creditors, setCreditors, orders, addToast }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showPayModal, setShowPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", totalCredit: 0, paid: 0 });

  const filtered = creditors.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const openAdd = () => { setEditItem(null); setForm({ name: "", phone: "", address: "", totalCredit: 0, paid: 0 }); setShowModal(true); };
  const openEdit = (c) => { setEditItem(c); setForm({ ...c }); setShowModal(true); };

  const save = () => {
    if (!form.name) { addToast("error", "Name is required"); return; }
    if (editItem) {
      setCreditors(prev => prev.map(c => c.id === editItem.id ? { ...c, ...form } : c));
      addToast("success", "Creditor updated");
    } else {
      setCreditors(prev => [...prev, { ...form, id: Date.now() }]);
      addToast("success", "Creditor added");
    }
    setShowModal(false);
  };

  const recordPayment = () => {
    const amt = Number(payAmount);
    if (!amt || amt <= 0) { addToast("error", "Enter valid amount"); return; }
    setCreditors(prev => prev.map(c => c.id === showPayModal.id ? { ...c, paid: c.paid + amt } : c));
    addToast("success", `Rs ${amt} recorded`);
    setShowPayModal(null); setPayAmount("");
  };

  const del = (id) => { setCreditors(prev => prev.filter(c => c.id !== id)); addToast("success", "Creditor removed"); };

  const creditorOrders = (name) => orders.filter(o => o.creditor === name);

  return (
    <div>
      <div className="page-header">
        <div><h2>Creditors</h2><p>Manage credit customers and outstanding balances</p></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Creditor</button>
      </div>
      <div className="page-content">
        <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat-card">
            <div className="s-label">TOTAL CREDIT GIVEN</div>
            <div className="s-value">Rs {creditors.reduce((s, c) => s + c.totalCredit, 0).toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="s-label">TOTAL PAID</div>
            <div className="s-value" style={{ color: "#86EFAC" }}>Rs {creditors.reduce((s, c) => s + c.paid, 0).toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="s-label">OUTSTANDING</div>
            <div className="s-value" style={{ color: "#FCA5A5" }}>Rs {creditors.reduce((s, c) => s + (c.totalCredit - c.paid), 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="search-row">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input placeholder="Search creditors…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Creditor</th><th>Phone</th><th>Address</th><th>Credit</th><th>Paid</th><th>Outstanding</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(c => {
                const outstanding = c.totalCredit - c.paid;
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 15 }}>{c.name[0]}</div>
                        <span style={{ fontWeight: 600, color: "var(--white)" }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: "monospace" }}>{c.phone}</td>
                    <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.address}</td>
                    <td style={{ fontWeight: 600 }}>Rs {c.totalCredit.toLocaleString()}</td>
                    <td style={{ color: "#86EFAC" }}>Rs {c.paid.toLocaleString()}</td>
                    <td>
                      <span className={`creditor-balance ${outstanding > 0 ? "balance-outstanding" : "balance-paid"}`}>
                        Rs {outstanding.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-success btn-sm" onClick={() => setShowPayModal(c)}>💳 Pay</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>✏️</button>
                        <button className="btn btn-danger btn-sm" onClick={() => del(c.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><div className="e-icon">👤</div><h3>No creditors found</h3></div>}
        </div>

        {/* Credit order history */}
        {filtered.map(c => {
          const cOrders = creditorOrders(c.name);
          if (!cOrders.length) return null;
          return (
            <div key={c.id} className="card" style={{ marginTop: 16 }}>
              <h3 style={{ marginBottom: 12, fontSize: 14 }}>📋 {c.name}'s Credit History</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Bill #</th><th>Date</th><th>Items</th><th>Amount</th></tr></thead>
                  <tbody>
                    {cOrders.map(o => (
                      <tr key={o.id}>
                        <td><span style={{ fontFamily: "monospace", color: "var(--amber)" }}>#{o.id}</span></td>
                        <td>{o.date}</td>
                        <td>{o.items.map(i => i.name).join(", ")}</td>
                        <td style={{ fontWeight: 700, color: "var(--white)" }}>Rs {o.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editItem ? "Edit Creditor" : "Add Creditor"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-group"><label>Full Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Customer name" /></div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="07X XXX XXXX" /></div>
            <div className="form-group"><label>Address</label><textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full address" /></div>
            <div className="grid-2">
              <div className="form-group"><label>Total Credit (Rs)</label><input type="number" value={form.totalCredit} onChange={e => setForm(f => ({ ...f, totalCredit: Number(e.target.value) }))} /></div>
              <div className="form-group"><label>Amount Paid (Rs)</label><input type="number" value={form.paid} onChange={e => setForm(f => ({ ...f, paid: Number(e.target.value) }))} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editItem ? "Save" : "Add"}</button>
            </div>
          </div>
        </div>
      )}

      {showPayModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPayModal(null)}>
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h3>💳 Record Payment</h3>
              <button className="modal-close" onClick={() => setShowPayModal(null)}>×</button>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>{showPayModal.name}</div>
              <div style={{ fontSize: 13, color: "var(--mid)" }}>Outstanding: <span style={{ color: "#FCA5A5", fontWeight: 700 }}>Rs {(showPayModal.totalCredit - showPayModal.paid).toLocaleString()}</span></div>
            </div>
            <div className="form-group"><label>Payment Amount (Rs)</label><input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="0.00" autoFocus /></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowPayModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={recordPayment}>Record Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────
function EmployeesPage({ users, setUsers, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", username: "", password: "", role: "employee", status: "active" });

  const openAdd = () => { setEditItem(null); setForm({ name: "", phone: "", username: "", password: "", role: "employee", status: "active" }); setShowModal(true); };
  const openEdit = (u) => { setEditItem(u); setForm({ ...u }); setShowModal(true); };

  const save = () => {
    if (!form.name || !form.username || !form.password) { addToast("error", "Name, username and password required"); return; }
    if (editItem) {
      setUsers(prev => prev.map(u => u.id === editItem.id ? { ...u, ...form } : u));
      addToast("success", "Employee updated");
    } else {
      if (users.find(u => u.username === form.username)) { addToast("error", "Username already exists"); return; }
      setUsers(prev => [...prev, { ...form, id: Date.now() }]);
      addToast("success", "Employee added");
    }
    setShowModal(false);
  };

  const toggle = (id) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)); };
  const del = (id) => { setUsers(prev => prev.filter(u => u.id !== id)); addToast("success", "Employee removed"); };

  return (
    <div>
      <div className="page-header">
        <div><h2>Employees</h2><p>Manage team accounts and roles</p></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Employee</button>
      </div>
      <div className="page-content">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Employee</th><th>Username</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{u.name[0]}</div>
                      <span style={{ fontWeight: 600, color: "var(--white)" }}>{u.name}</span>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: "monospace", color: "var(--mid)" }}>@{u.username}</span></td>
                  <td>{u.phone}</td>
                  <td><span className={`badge ${u.role === "admin" ? "badge-amber" : "badge-blue"}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.status === "active" ? "badge-green" : "badge-red"}`}>{u.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>✏️ Edit</button>
                      <button className="btn btn-sm" style={{ background: u.status === "active" ? "rgba(220,38,38,0.1)" : "rgba(22,163,74,0.1)", color: u.status === "active" ? "#FCA5A5" : "#86EFAC", border: "none" }} onClick={() => toggle(u.id)}>{u.status === "active" ? "Deactivate" : "Activate"}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(u.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editItem ? "Edit Employee" : "Add Employee"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Full Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="07X XXX XXXX" /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Username *</label><input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="username" /></div>
              <div className="form-group"><label>Password *</label><input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Role</label><select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}><option value="employee">Employee</option><option value="admin">Admin</option></select></div>
              <div className="form-group"><label>Status</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editItem ? "Save" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function ReportsPage({ orders, products, creditors, users }) {
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [tab, setTab] = useState("sales");

  const filtered = orders.filter(o => o.date >= dateFrom && o.date <= dateTo);
  const revenue = filtered.reduce((s, o) => s + o.total, 0);
  const cashRev = filtered.filter(o => o.paymentType === "cash").reduce((s, o) => s + o.total, 0);
  const creditRev = filtered.filter(o => o.paymentType === "credit").reduce((s, o) => s + o.total, 0);

  const productSales = {};
  filtered.forEach(o => o.items.forEach(i => {
    if (!productSales[i.name]) productSales[i.name] = { qty: 0, revenue: 0 };
    productSales[i.name].qty += i.qty;
    productSales[i.name].revenue += i.total || (i.price * i.qty);
  }));
  const topProducts = Object.entries(productSales).sort((a, b) => b[1].revenue - a[1].revenue);

  const empSales = {};
  filtered.forEach(o => {
    if (!empSales[o.employee]) empSales[o.employee] = { orders: 0, revenue: 0 };
    empSales[o.employee].orders++;
    empSales[o.employee].revenue += o.total;
  });

  const printReport = () => window.print();

  return (
    <div>
      <div className="page-header">
        <div><h2>Reports & Analytics</h2><p>Business performance overview</p></div>
        <button className="btn btn-secondary" onClick={printReport}>🖨 Print</button>
      </div>
      <div className="page-content">
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>From</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: "10px 14px" }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>To</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: "10px 14px" }} />
            </div>
            <div style={{ fontSize: 13, color: "var(--mid)", paddingBottom: 4 }}>{filtered.length} orders in range</div>
          </div>
        </div>

        <div className="stat-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card"><div className="s-label">TOTAL REVENUE</div><div className="s-value">Rs {revenue.toLocaleString()}</div></div>
          <div className="stat-card"><div className="s-label">CASH SALES</div><div className="s-value">Rs {cashRev.toLocaleString()}</div></div>
          <div className="stat-card"><div className="s-label">CREDIT SALES</div><div className="s-value">Rs {creditRev.toLocaleString()}</div></div>
          <div className="stat-card"><div className="s-label">TOTAL ORDERS</div><div className="s-value">{filtered.length}</div></div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["sales", "products", "employees", "credits"].map(t => (
            <button key={t} className={`filter-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
          ))}
        </div>

        {tab === "sales" && (
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 15 }}>📋 All Orders</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Bill #</th><th>Date</th><th>Employee</th><th>Items</th><th>Payment</th><th>Creditor</th><th>Total</th></tr></thead>
                <tbody>
                  {filtered.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontFamily: "monospace", color: "var(--amber)" }}>#{o.id}</td>
                      <td>{o.date}</td>
                      <td>{o.employee}</td>
                      <td>{o.items.length} item(s)</td>
                      <td><span className={`badge ${o.paymentType === "cash" ? "badge-green" : "badge-amber"}`}>{o.paymentType}</span></td>
                      <td style={{ color: "var(--mid)" }}>{o.creditor || "—"}</td>
                      <td style={{ fontWeight: 700, color: "var(--white)" }}>Rs {o.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 15 }}>📦 Product Sales Report</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Product</th><th>Quantity Sold</th><th>Revenue</th></tr></thead>
                <tbody>
                  {topProducts.map(([name, data]) => (
                    <tr key={name}>
                      <td style={{ fontWeight: 600, color: "var(--white)" }}>{name}</td>
                      <td>{data.qty} units</td>
                      <td style={{ fontWeight: 700, color: "var(--amber)" }}>Rs {data.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "employees" && (
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 15 }}>👤 Employee Sales</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Employee</th><th>Total Orders</th><th>Total Revenue</th></tr></thead>
                <tbody>
                  {Object.entries(empSales).map(([emp, data]) => (
                    <tr key={emp}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{emp[0].toUpperCase()}</div>
                          <span style={{ fontWeight: 600, color: "var(--white)" }}>{emp}</span>
                        </div>
                      </td>
                      <td>{data.orders}</td>
                      <td style={{ fontWeight: 700, color: "var(--amber)" }}>Rs {data.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "credits" && (
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 15 }}>💳 Credit Report</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Creditor</th><th>Phone</th><th>Total Credit</th><th>Paid</th><th>Outstanding</th></tr></thead>
                <tbody>
                  {creditors.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600, color: "var(--white)" }}>{c.name}</td>
                      <td>{c.phone}</td>
                      <td>Rs {c.totalCredit.toLocaleString()}</td>
                      <td style={{ color: "#86EFAC" }}>Rs {c.paid.toLocaleString()}</td>
                      <td style={{ color: (c.totalCredit - c.paid) > 0 ? "#FCA5A5" : "#86EFAC", fontWeight: 700 }}>
                        Rs {(c.totalCredit - c.paid).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────
function OrdersPage({ orders }) {
  const [search, setSearch] = useState("");
  const filtered = orders.filter(o => String(o.id).includes(search) || o.employee.includes(search.toLowerCase()) || (o.creditor || "").toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div className="page-header"><div><h2>Order History</h2><p>{orders.length} orders total</p></div></div>
      <div className="page-content">
        <div className="search-row">
          <div className="search-wrap"><span className="search-icon">🔍</span><input placeholder="Search bills…" value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Bill #</th><th>Date</th><th>Employee</th><th>Items</th><th>Payment</th><th>Creditor</th><th>Total</th></tr></thead>
            <tbody>
              {[...filtered].reverse().map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: "monospace", color: "var(--amber)", fontWeight: 700 }}>#{o.id}</td>
                  <td>{o.date}</td>
                  <td>{o.employee}</td>
                  <td>
                    <div style={{ fontSize: 12, color: "var(--mid)" }}>{o.items.map(i => `${i.name}×${i.qty}`).join(", ")}</div>
                  </td>
                  <td><span className={`badge ${o.paymentType === "cash" ? "badge-green" : "badge-amber"}`}>{o.paymentType}</span></td>
                  <td style={{ color: "var(--mid)" }}>{o.creditor || "—"}</td>
                  <td style={{ fontWeight: 700, color: "var(--white)" }}>Rs {o.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
function SettingsPage({ currentUser, addToast }) {
  return (
    <div>
      <div className="page-header"><div><h2>Settings</h2><p>System configuration</p></div></div>
      <div className="page-content">
        <div className="grid-2">
          <div className="card">
            <h3 style={{ marginBottom: 20, fontSize: 15 }}>🏪 Business Info</h3>
            <div className="form-group"><label>Business Name</label><input defaultValue="Theja Food Product" /></div>
            <div className="form-group"><label>Phone</label><input defaultValue="+94 71 XXX XXXX" /></div>
            <div className="form-group"><label>Address</label><textarea defaultValue="Sri Lanka" /></div>
            <button className="btn btn-primary" onClick={() => addToast("success", "Settings saved!")}>Save</button>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 20, fontSize: 15 }}>🖨 Printer Settings</h3>
            <div className="form-group"><label>Paper Width</label><select><option>58mm</option><option>80mm</option></select></div>
            <div className="form-group"><label>Printer Type</label><select><option>Bluetooth</option><option>USB</option><option>Network</option></select></div>
            <div className="form-group"><label>Receipt Footer</label><textarea defaultValue="Thank you for your purchase! 🙏" /></div>
            <button className="btn btn-primary" onClick={() => addToast("success", "Printer settings saved!")}>Save</button>
          </div>
        </div>
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 16, fontSize: 15 }}>👤 Account</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "rgba(255,255,255,0.04)", borderRadius: 12 }}>
            <div className="user-avatar" style={{ width: 56, height: 56, fontSize: 24 }}>{currentUser.name[0]}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "var(--white)" }}>{currentUser.name}</div>
              <div style={{ fontSize: 13, color: "var(--mid)" }}>@{currentUser.username} · {currentUser.role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("pos");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [creditors, setCreditors] = useState(INITIAL_CREDITORS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [toasts, setToasts] = useState([]);

  const addToast = (type, msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const logout = () => { setCurrentUser(null); setPage("pos"); };

  const isAdmin = currentUser?.role === "admin";

  const adminNav = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "pos", icon: "🛒", label: "POS Billing" },
    { id: "orders", icon: "🧾", label: "Orders" },
    { id: "products", icon: "📦", label: "Products" },
    { id: "creditors", icon: "💳", label: "Creditors" },
    { id: "employees", icon: "👥", label: "Employees" },
    { id: "reports", icon: "📈", label: "Reports" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const empNav = [
    { id: "pos", icon: "🛒", label: "POS Billing" },
    { id: "orders", icon: "🧾", label: "Orders" },
  ];

  const navItems = isAdmin ? adminNav : empNav;

  if (!currentUser) {
    return (
      <>
        <style>{style}</style>
        <LoginPage users={users} onLogin={u => { setCurrentUser(u); setPage(u.role === "admin" ? "dashboard" : "pos"); }} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return isAdmin ? <Dashboard orders={orders} products={products} creditors={creditors} users={users} /> : null;
      case "pos": return <POSPage products={products} currentUser={currentUser} creditors={creditors} orders={orders} setOrders={setOrders} addToast={addToast} />;
      case "orders": return <OrdersPage orders={orders} />;
      case "products": return isAdmin ? <ProductsPage products={products} setProducts={setProducts} addToast={addToast} /> : null;
      case "creditors": return isAdmin ? <CreditorsPage creditors={creditors} setCreditors={setCreditors} orders={orders} addToast={addToast} /> : null;
      case "employees": return isAdmin ? <EmployeesPage users={users} setUsers={setUsers} addToast={addToast} /> : null;
      case "reports": return isAdmin ? <ReportsPage orders={orders} products={products} creditors={creditors} users={users} /> : null;
      case "settings": return isAdmin ? <SettingsPage currentUser={currentUser} addToast={addToast} /> : null;
      default: return null;
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="main-layout">
          {/* Sidebar */}
          <div className="sidebar no-print">
            <div className="sidebar-logo">
              <div className="s-icon">🍮</div>
              <div className="s-text"><h3>Theja Food</h3><p>POS System</p></div>
            </div>
            <nav className="sidebar-nav">
              <div className="nav-section">
                {navItems.map(n => (
                  <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                    <span className="nav-icon">{n.icon}</span>
                    {n.label}
                  </div>
                ))}
              </div>
            </nav>
            <div className="sidebar-footer">
              <div className="user-info">
                <div className="user-avatar">{currentUser.name[0]}</div>
                <div className="u-text">
                  <div className="u-name">{currentUser.name}</div>
                  <div className="u-role">{currentUser.role}</div>
                </div>
                <button onClick={logout} style={{ background: "none", border: "none", color: "var(--mid)", cursor: "pointer", fontSize: 16, padding: "4px 6px", borderRadius: 6, transition: "all 0.15s" }} title="Logout">⏻</button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="content-area">
            {renderPage()}
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="mobile-bottom-nav no-print">
          {navItems.map(n => (
            <div key={n.id} className={`mob-nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span className="m-icon">{n.icon}</span>
              {n.label}
            </div>
          ))}
          <div className="mob-nav-item" onClick={logout}>
            <span className="m-icon">⏻</span>
            Logout
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
