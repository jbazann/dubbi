const es: LocalizedStrings = {
    index: {

    },
    notice: {
        "forced-redirect": "\"forzar-lenguaje\" está  activado, por lo que fuiste redirigido/a de \"!{from}\" a \"!{to}\". Si tu intención era ver un lenguaje diferente, usá \"set lenguaje\" para cambiar tu idioma, o \"set forzar-lenguaje false\" para desactivar esta funcionalidad.",
        "notice-preface": "AVISO: ",
        "error-preface": "ERROR: ",
        "ignore": "si no entendiste el mensaje anterior, lo podés ignorar sin miedo."
    },
    cmd: {
        cat: {
            msg: {
                err: "No encontré los gatos :(",
            }
        },
        settings: {
            msg: {
                variants: "También válido: s, set, setting, settings.",
                usage: "Modo de uso: settings [opción] [valor]",
                available: "Opciones disponibles: !{available}.", // !{available}
                try: "Probá settings [opción] para ver más detalles sobre una opción en particular.",
                current: "Configuración actual: !{settings}", // !{settings}
                invalid: "Opción inválida \"!{arg}\"." // !{arg}
            },
            names: {
                theme: "tema",
                language: "lenguaje",
                "force-language": "forzar-lenguaje"
            },
            "force-language": {
                msg: {
                    available: "Opciones disponibles: !{opt}.", // !{opt}
                    set: "Forzar-lenguaje: !{val}.", // !{val}
                    invalid: "Valor inválido: !{val}.", // !{val}
                }
            },
            language: {
                msg: {
                    available: "Lenguajes disponibles: !{opt}",  // !{opt}
                    en: "Switching language to English.",
                    es: "Cambiando lenguage a Español.",
                    invalid: "Lenguage inválido \"!{lang}\"", // !{lang}
                    neterr: "Something went wrong loading the new language. Please refresh the page."
                }
            },
            theme: {
                msg: {
                    available: "Temas disponibles: !{opt}.", // !{opt}
                    invalid: "Tema inválido \"!{v}\".", // !{v}
                    set: "Tema actual: !{v}.", // !{v}
                },
                names: {
                    "autumn-dawn": "otoño-dia",
                    "autumn-dusk": "otoño-noche",
                    "psycho-stark": "psycho-stark",
                    "neo-cyan": "neo-celeste",
                    "cloudy-salmon": "salmon-nube",
                    "nightly-lavender": "lavanda-nocturna",
                    "dainty-elegance": "delicada-elegancia",
                }
            }
        },
        _silly: {
            msg1: "Excepto por esas, era un ejemplo. Deja de clickearlas.",
            msg2: "Deja de clickearlas.",
            msg3: "Basta.",
            msg4: "BASTA.",
            msg5: "Última advertencia.",
        }
    }
}

export default es