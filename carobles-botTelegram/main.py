import telebot
from config import TELEGRAM_TOKEN
from Services import ClienteService
from ExtraerMontoImagen import extraerMontoTransferencia

import os
import uuid
from datetime import datetime

# Instancia del bot
bot = telebot.TeleBot(TELEGRAM_TOKEN)
usuarios_autos = {}  # { telegram_id: {"curp": str, "ids_validos": [int, ...]} }


@bot.message_handler(commands=["start"])
def start_handler(messageStart):
    telegram_id = messageStart.from_user.id
    nombre = ClienteService.obtenerNombreClienteByIdTelegram(telegram_id)

    if nombre is None:
        bot.reply_to(messageStart, "Parece que es tu primera vez. Envíame tu CURP.")
        return

    bot.reply_to(messageStart, f"Bienvenido de nuevo {nombre}")
    curp_cliente = ClienteService.obtenerCURPClienteByIdTelegram(telegram_id)  # debe ser str
    if curp_cliente:
        mostrar_automoviles_credito(messageStart, curp_cliente)
    else:
        bot.reply_to(messageStart, "No encontré tu CURP registrada. Envíamela, por favor.")


@bot.message_handler(content_types=['text'])
def solicita_CURP(messageCURP):
    curp_recibido = messageCURP.text.upper().strip()
    telegram_id = messageCURP.from_user.id
    if len(curp_recibido) != 18:
        bot.reply_to(messageCURP, "Ingresa un CURP válido")
    else:
        nombre = ClienteService.obtenerNombreCliente(curp_recibido)
        ClienteService.guaradrUsuarioTelegram(telegram_id, curp_recibido, nombre)
        bot.reply_to(messageCURP, f"Bienvenido {nombre}, ya te he registrado con éxito")
        mostrar_automoviles_credito(messageCURP, curp_recibido)


def mostrar_automoviles_credito(messageCURP, CURP):
    autos = ClienteService.obtenerAutosACredito(CURP) or []
    if not autos:
        bot.send_message(messageCURP.chat.id, "No tienes autos a crédito.")
        return
    
    ids_validos = []
    for auto in autos:
        id_auto = auto[0]
        ids_validos.append(id_auto)
        bot.send_message(
            messageCURP.chat.id,
            f"ID: {id_auto}, marca: {auto[1]}, modelo: {auto[2]}, año: {auto[3]}, serie: {auto[4]}"
        )
    
    # Guardamos CURP e IDs válidos para este usuario
    usuarios_autos[messageCURP.from_user.id] = {
        "curp": CURP,
        "ids_validos": ids_validos
    }

    msgInstruccion = bot.send_message(messageCURP.chat.id, "Escribe el ID del auto que elegiste:")
    bot.register_next_step_handler(msgInstruccion, seleccionIdCredito)



def seleccionIdCredito(messageID):
    telegram_id = messageID.from_user.id
    texto = (messageID.text or "").strip()

    datos_usuario = usuarios_autos.get(telegram_id)
    if not datos_usuario or "ids_validos" not in datos_usuario:
        bot.send_message(messageID.chat.id, "Por favor, usa /start.")
        return

    ids_validos = datos_usuario.get("ids_validos", [])

    # 2) Valida que sea número
    if not texto.isdigit():
        msg = bot.send_message(messageID.chat.id, "El ID debe ser un número. Intenta de nuevo:")
        bot.register_next_step_handler(msg, seleccionIdCredito)
        return

    id_auto = int(texto)

    # 3) Valida que el ID pertenezca a los mostrados
    if id_auto not in ids_validos:
        opciones = ", ".join(map(str, ids_validos)) if ids_validos else "—"
        msg = bot.send_message(
            messageID.chat.id,
            f"ID inválido. Elige uno de la lista mostrada ({opciones})."
        )
        bot.register_next_step_handler(msg, seleccionIdCredito)
        return

    # 4) Guardar la selección y confirmar
    usuarios_autos[telegram_id]["id_seleccionado"] = id_auto
    bot.send_message(messageID.chat.id, f"Auto seleccionado ID: {id_auto}")

    msg = bot.send_message(
    messageID.chat.id,
    "Ahora envía la imagen del comprobante (tiene que ser en formato .jpg, .jpeg o .png). " \
    "Si lo tienes en pdf toma una captura donde se logre apreciar el monto transferido y el spei" \
    "Si fue un Deposito en efectivo toma una imagen lo mas legible posible"
    )
    bot.register_next_step_handler(msg, recibirComprobante)


def recibirComprobante (message):
    telegram_id = message.from_user.id
    datos = usuarios_autos.get(telegram_id, {})
    id_auto = datos.get("id_seleccionado")
    curp = datos.get("curp")

    if not id_auto or not curp:
        bot.send_message(message.chat.id, "Usa /start para reiniciar el flujo.")
        return

    carpeta = r"C:\Users\Fernando Robles}\OneDrive\Desktop\autos\backend_spring\backend_spring\carobles-app\comprobantes_mensualidades"
    os.makedirs(carpeta, exist_ok=True)

    # Nombre único
    ahora = datetime.now().strftime("%Y%m%d_%H%M%S")
    sufijo = uuid.uuid4().hex[:8]

    # Solo fotos permitidas (ahora también documento-imagen)
    if (message.content_type == "photo" and message.photo) or (message.content_type == "document" and hasattr(message, "document")):
        # Determinar file_id y extensión permitida
        allowed_ext = [".jpg", ".jpeg", ".png"]

        if message.content_type == "photo":
            file_id = message.photo[-1].file_id  # última = mayor resolución
            file_info_tmp = bot.get_file(file_id)
            ext = os.path.splitext(file_info_tmp.file_path)[1].lower()
            if ext not in allowed_ext:
                ext = ".jpg"
        else:
            # document
            mime = (message.document.mime_type or "").lower()
            name = (message.document.file_name or "").lower()

            es_jpg_png = (
                mime in ["image/jpeg", "image/jpg", "image/png"]
                or name.endswith(tuple(allowed_ext))
            )
            if not es_jpg_png:
                # No es imagen JPG/PNG (por ejemplo PDF, WEBP, HEIC, etc.)
                msg = bot.send_message(
                    message.chat.id,
                    "Solo se aceptan imágenes JPG o PNG. Por favor, envía la foto del comprobante."
                )
                bot.register_next_step_handler(msg, recibirComprobante)
                return

            file_id = message.document.file_id
            # Fijar extensión final
            if name.endswith(tuple(allowed_ext)):
                ext = os.path.splitext(name)[1].lower()
            elif mime in ["image/jpeg", "image/jpg"]:
                ext = ".jpg"
            elif mime == "image/png":
                ext = ".png"
            else:
                ext = ".jpg"

        file_info = bot.get_file(file_id)
        contenido = bot.download_file(file_info.file_path)

        # Aseguramos extensión correcta
        if ext not in allowed_ext:
            ext = ".jpg"

        nombre_archivo = f"{ahora}_{curp}_{id_auto}_{sufijo}{ext}"
        ruta = os.path.join(carpeta, nombre_archivo)
        ruta_absoluta = os.path.abspath(ruta)

        with open(ruta, "wb") as f:
            f.write(contenido)

        monto = extraerMontoTransferencia(ruta)
        ClienteService.guardarComprobanteMensualidad(monto, ruta_absoluta, id_auto)

        bot.send_message(message.chat.id, f"Comprobante recibido y guardado con un monto de $ {monto} MXN")
        bot.send_message(message.chat.id, f"teclea /start para registrar una mensualidad mas")
        return

    # Si manda otra cosa que no sea foto
    msg = bot.send_message(
        message.chat.id,
        "Solo se aceptan imágenes JPG o PNG. Por favor, envía la foto del comprobante."
    )
    bot.register_next_step_handler(msg, recibirComprobante)


def iniciar_bot():
    import time
    while True:
        try:
            print("Iniciando bot con reintentos automáticos…")
            bot.polling(
                none_stop=True,          
                interval=1,             
                timeout=60,              
                long_polling_timeout=30 
            )
        except Exception as e:
            print(f"[WARN] Polling se cayó: {e}")
            time.sleep(2)  

if __name__ == "__main__":
    iniciar_bot()