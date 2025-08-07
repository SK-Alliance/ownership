'use client';

import { Shield, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    const footerLinks = {
        product: [
            { name: 'How it Works', href: '#' },
            { name: 'Features', href: '#' },
            { name: 'Pricing', href: '#' },
        ],
        company: [
            { name: 'How it Works', href: '#' },
            { name: 'About Us', href: '#' },
            { name: 'Contact', href: '#' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' },
            { name: 'Compliance', href: '#' }
        ]
    };

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' }
    ];

    return (
        <footer className="relative border-t border-main/20 overflow-hidden">
            {/* Liquid Glass Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.02) 0%, 
            rgba(255, 255, 255, 0.005) 50%, 
            transparent 100%
          )`,
                    backdropFilter: 'blur(20px)'
                }}
            />

            {/* Top Glass Edge */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background: `linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.1), 
            transparent
          )`
                }}
            />

            <div className="relative z-10 bg-bg-main/80">
                <div className="container mx-auto px-6 md:px-32 py-16 ">
                    <div className="max-w-7xl mx-auto">


                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-12 mb-4 ">
                            {/* Brand Section */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-gold/80 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-bg-main" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-clash text-main">Auctor</h3>
                                        <p className="text-xs text-muted mt-1">Built on Camp Network</p>
                                    </div>
                                </div>
                                <p className="text-muted leading-relaxed mb-6 max-w-md">
                                    Proving ownership of real-world assets through tamperproof digital certificates.
                                    The future of verifiable IP ownership.
                                </p>

                                {/* Social Links */}
                                <div className="flex items-center gap-4">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            aria-label={social.label}
                                            className="w-10 h-10 rounded-full border border-main/20 flex items-center justify-center text-muted hover:text-gold hover:border-gold/30 transition-all duration-300 relative overflow-hidden group"
                                            style={{
                                                background: `linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.05) 0%, 
                          rgba(255, 255, 255, 0.02) 50%, 
                          transparent 100%
                        )`
                                            }}
                                        >
                                            <social.icon className="w-4 h-4 relative z-10" />
                                            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Company Links */}
                            <div>
                                <h4 className="text-main font-semibold mb-4 text-sm uppercase tracking-wider">
                                    Company
                                </h4>
                                <ul className="space-y-3">
                                    {footerLinks.company.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.href}
                                                className="text-muted hover:text-main transition-colors duration-300 text-sm"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Legal Links */}
                            <div>
                                <h4 className="text-main font-semibold mb-4 text-sm uppercase tracking-wider">
                                    Legal
                                </h4>
                                <ul className="space-y-3">
                                    {footerLinks.legal.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.href}
                                                className="text-muted hover:text-main transition-colors duration-300 text-sm"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div
                            className="border-t border-main/10 pt-8 relative"
                            style={{
                                background: `linear-gradient(90deg, 
                  transparent, 
                  rgba(255, 255, 255, 0.02) 50%, 
                  transparent
                )`
                            }}
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-sm text-muted">
                                    <span>© {new Date().getFullYear()} Auctor</span>
                                    <span className="w-1 h-1 bg-muted rounded-full" />
                                    <span>All rights reserved</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted">Built with ❤️ by</span>
                                    <a
                                        href="https://sk-alliance.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gold hover:text-gold/80 transition-colors duration-300 font-semibold"
                                    >
                                        SK Alliance
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Background Gradients */}
            <div className="absolute bottom-0 left-0 w-64 h-32 bg-gold/3 rounded-full blur-3xl -translate-x-32 translate-y-16" />
            <div className="absolute bottom-0 right-0 w-48 h-24 bg-green/3 rounded-full blur-2xl translate-x-24 translate-y-12" />
        </footer>
    );
}
