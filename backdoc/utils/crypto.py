# utils/crypto.py
import base64
import os
from django.conf import settings

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


# --- Key Loading ---
raw_key = base64.b64decode(settings.AES_KEY)
aesgcm = AESGCM(raw_key)

# nonce length recommended = 12 bytes
NONCE_SIZE = 12


# -------- TEXT --------
def encrypt(text: str) -> bytes:
    nonce = os.urandom(NONCE_SIZE)
    ciphertext = aesgcm.encrypt(nonce, text.encode(), None)
    return base64.b64encode(nonce + ciphertext)


def decrypt(token: bytes) -> str:
    data = base64.b64decode(token)
    nonce = data[:NONCE_SIZE]
    ciphertext = data[NONCE_SIZE:]
    return aesgcm.decrypt(nonce, ciphertext, None).decode()


# -------- BYTES --------
def encrypt_bytes(data: bytes) -> bytes:
    nonce = os.urandom(NONCE_SIZE)
    ciphertext = aesgcm.encrypt(nonce, data, None)
    return base64.b64encode(nonce + ciphertext)


def decrypt_bytes(token: bytes) -> bytes:
    data = base64.b64decode(token)
    nonce = data[:NONCE_SIZE]
    ciphertext = data[NONCE_SIZE:]
    return aesgcm.decrypt(nonce, ciphertext, None)
