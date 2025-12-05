from django.db import models
from utils.crypto import encrypt, decrypt


class EncryptedTextField(models.TextField):
    description = "Text field that encrypts value before saving (Fernet via settings.f)."

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value

        try:
            # DB stores string → convert back to bytes
            return decrypt(value.encode())
        except Exception:
            # Fallback for legacy plaintext or corrupted data
            return value

    def to_python(self, value):
        if value is None:
            return value

        # Prevent double decryption
        try:
            return decrypt(value.encode())
        except Exception:
            return value

    def get_prep_value(self, value):
        if value is None:
            return None

        try:
            # Encrypt returns bytes → store as string in DB
            return encrypt(value).decode()
        except Exception:
            return value
