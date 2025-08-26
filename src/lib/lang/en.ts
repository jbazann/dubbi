const en: LocalizedStrings = {
    notice: {
        "forced-redirect": "\"force-language\" is currently set to \"true\", so you were redirected from \"!{from}\" to \"!{to}\". \nIf you were trying to browse a different language, use \"set language\" to change your language, or \"set force-language false\" to disable this behavior.",  // !{from} !{to}
        "notice-preface": "NOTICE: ",
        "error-preface": "ERROR: ",
        "ignore": "if you did not understand the previous message, you may ignore it without worry."
    },
    cmd: {
        cat: {
            msg: {
                err: "Couldn't find the kitties :(",
                fetching: "Searching for beasts...",
                no_impl: "The version with arguments of cat is not implemented yet.",
            },
            alt: "A very dangerous beast (a cat)."
        },
        whoami: {
            msg: {
                fake: "You are currently \"guest\"."
            }
        },
        ls: {
            msg: {
                err: "there was an error querying the directory. Are you in a valid path?",
                tip: "use the sitemap command to return to a valid directory.",
            },
        },
        help: {
            msg: {
                soon: "Help sections by command will be available in a few days. Good luck in the meantime!",
                unknown: "Unknown help section: \"!{cmd}\".", // !{cmd}
                inv_opt: "Invalid option: \"!{opt}\".", // !{opt}
            },
        },
        settings: {
            msg: {
                variants: { 
                    pref: "Also valid: ",
                    line: "s, set, setting, settings.",
                },
                usage: {
                    pref: "Usage: ",
                    line: "settings [setting] [value]",
                },
                available: {
                    pref: "Available settings: ",
                },
                try: {
                    pref: "Tip: ",
                    line: "try settings [setting] to see more details about a setting option.",
                },
                current: {
                    pref: "Current settings: ",
                },
                invalid: "Invalid setting \"!{arg}\".", // !{arg}
            },
            names: {
                theme: "theme",
                language: "language",
                "force-language": "force-language"
            },
            cookies: {
                msg: {
                    mandatory: "My cookies are mandatory. I promise they don't do anything illegal. :)"
                }
            },
            logging: {
                msg: {
                    available: "Available options: !{opt}.", // !{opt}
                    set: "Logging set to: !{val}.", // !{val}
                    invalid: "Invalid force-language value: !{val}.", // !{val}
                }
            },
            "force-language": {
                msg: {
                    available: "Available options: !{opt}.", // !{opt}
                    set: "Force-language set to: !{val}.", // !{val}
                    invalid: "Invalid force-language value: !{val}.", // !{val}
                }
            },
            language: {
                msg: {
                    available: "Available languages: !{opt}", // !{opt}
                    en: "Switching language to English.",
                    es: "Cambiando lenguage a Español.",
                    invalid: "Invalid language \"!{lang}\"", // !{lang}
                    neterr: "Algo salió mal al cargar el nuevo idioma. Por favor vuelva a cargar la página.",
                }
            },
            theme: {
                msg: {
                    available: "Available themes: !{opt}.", // !{opt}
                    invalid: "Invalid theme \"!{v}\".", // !{v}
                    set: "Current theme: !{v}.", // !{v}
                },
                names: {
                    "autumn-dawn": "autumn-dawn",
                    "autumn-dusk": "autumn-dusk",
                    "psycho-stark": "psycho-stark",
                    "neo-cyan": "neo-cyan",
                    "cloudy-salmon": "cloudy-salmon",
                    "nightly-lavender": "nightly-lavender",
                    "dainty-elegance": "dainty-elegance",
                }
            }
        },
        _silly: {
            msg1: "Except for those, they're just an example. Stop clicking them.",
            msg2: "Stop clicking them.",
            msg3: "Stop.",
            msg4: "STOP.",
            msg5: "Last warning.",
        }
    }
}

export default en