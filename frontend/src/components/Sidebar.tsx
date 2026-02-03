'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface MenuItem {
  label: string;
  href?: string;
  icon?: string;
  children?: MenuItem[];
}

interface MenuSection {
  title: string;
  color: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Dashboard',
    color: 'bg-blue-500',
    items: [
      { label: 'Dashboard', href: '/', icon: '📊' },
    ],
  },
  {
    title: 'Setting',
    color: 'bg-cyan-500',
    items: [
      { label: 'Intranet Menu', href: '/settings/menu', icon: '📋' },
      { label: 'Audit Trail', href: '/settings/audit', icon: '📝' },
    ],
  },
  {
    title: 'Portal Administration',
    color: 'bg-blue-600',
    items: [
      { label: 'Menu', href: '/portal/menu', icon: '📑' },
      { label: 'Articles', href: '/portal/articles', icon: '📰' },
      { label: 'Portal Media', href: '/portal/media', icon: '🖼️' },
      { label: 'Promo Code', href: '/portal/promo', icon: '🎫' },
      { label: 'Advertisement', href: '/portal/ads', icon: '📢' },
      { label: 'Portal Gallery', href: '/portal/gallery', icon: '🖼️' },
      { label: 'Board', href: '/portal/board', icon: '📌' },
    ],
  },
  {
    title: 'Intranet Administration',
    color: 'bg-yellow-500',
    items: [
      { label: 'Manage User', href: '/users', icon: '👥' },
      { label: 'E-Commerce Admin', href: '/admin/ecommerce', icon: '🛒' },
      { label: 'Internal Circular', href: '/admin/circular', icon: '📄' },
      { label: 'Operation Information', href: '/admin/operations', icon: '⚙️' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(
    menuSections.map((s) => s.title)
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-slate-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
            K
          </div>
          <div>
            <h1 className="text-white font-semibold">Staff Dashboard</h1>
            <p className="text-slate-400 text-xs">(Main Administrator)</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-1">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.title)}
              className={`w-full flex items-center justify-between px-4 py-2 text-white text-sm font-medium ${section.color} hover:opacity-90 transition-opacity`}
            >
              <span>{section.title}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  expandedSections.includes(section.title) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Section Items */}
            {expandedSections.includes(section.title) && (
              <div className="bg-slate-900">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href || '#'}
                    className={`flex items-center gap-3 px-6 py-2 text-sm transition-colors ${
                      isActive(item.href || '')
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <p className="text-slate-400 text-xs text-center">KTMB POC v1.0</p>
      </div>
    </aside>
  );
}
