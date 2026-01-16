
import React from 'react';
import './TerminalSection.css';

export function TerminalSection() {
    return (
        <section className="py-24 container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Stay in <span className="text-primary">Flow</span>
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        You didn't become a developer to fill out forms. Evergreeners works silently in the background, turning your commit history into tangible progress without interrupting your work.
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Zero friction logging
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Automatic commit detection
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Works with your existing tools
                        </li>
                    </ul>
                </div>

                <div className="md:w-1/2 flex justify-center">
                    <div className="terminal-card">
                        <div className="terminal-wrap">
                            <div className="terminal-terminal">
                                <hgroup className="terminal-head">
                                    <p className="terminal-title">
                                        <svg
                                            width="16px"
                                            height="16px"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="none"
                                        >
                                            <path
                                                d="M7 15L10 12L7 9M13 15H17M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
                                            ></path>
                                        </svg>
                                        Terminal
                                    </p>

                                    <button className="terminal-copy_toggle" tabIndex={-1} type="button">
                                        <svg
                                            width="16px"
                                            height="16px"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="none"
                                        >
                                            <path
                                                d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
                                            ></path>
                                            <path
                                                d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"
                                            ></path>
                                        </svg>
                                    </button>
                                </hgroup>

                                <div className="terminal-body">
                                    <pre className="terminal-pre">
                                        <code>➜&nbsp;</code>
                                        <code>~&nbsp;</code>
                                        <code className="terminal-cmd" data-cmd="git push origin main"></code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
