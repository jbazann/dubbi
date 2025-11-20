type LocalizedStrings = {
    menu: {
        secret: {
            label: string
            children: string
        }
        language: {
            alt: {
                es: string
                en: string
            }
        }
    }
    notice: {
        "forced-redirect": string // !{from} !{to}
        "notice-preface": string
        "error-preface": string
        "ignore": string
    },
    cmd: {
        cat: {
            msg: {
                err: string
                fetching: string
                no_impl: string
            }
            alt: string
        }
        whoami: {
            msg: {
                fake: string
            }
        }
        ls: {
            msg: {
                err: string
                tip: string
            }
        }
        help: {
            msg: {
                soon: string
                unknown: string // !{cmd}
                inv_opt: string // !{opt}
            }
        }
        settings: {
            msg: {
                variants: {
                    pref: string
                    line: string
                }
                usage: {
                    pref: string
                    line: string
                }
                available: {
                    pref: string
                } 
                try: {
                    pref: string
                    line: string
                }
                current: {
                    pref: string
                } 
                invalid: string // !{arg}
            }
            names: {
                theme: string
                language: string
                "force-language": string
            }
            cookies: {
                msg: {
                    mandatory: string
                }
            }
            logging: {
                msg: {
                    available: string // !{opt}
                    set: string // !{val}
                    invalid: string // !{val}
                }
            }
            "force-language": {
                msg: {
                    available: string // !{opt}
                    set: string // !{val}
                    invalid: string // !{val}
                }
            }
            language: {
                msg: {
                    available: string // !{opt}
                    en: string
                    es: string
                    invalid: string // !{lang}
                    neterr: string
                }
            },
            theme: {
                msg: {
                    available: string // !{opt}
                    invalid: string // !{v}
                    set: string // !{v}
                }
                names: {
                    "autumn-dawn": string
                    "autumn-dusk": string
                    "psycho-stark": string
                    "neo-cyan": string
                    "cloudy-salmon": string
                    "nightly-lavender": string
                    "dainty-elegance": string
                }
            }
        }
        _silly: {
            msg1: string
            msg2: string
            msg3: string
            msg4: string
            msg5: string
        }
    }
}