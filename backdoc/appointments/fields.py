import datetime
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
        


class EncryptedDateTimeField(models.TextField):
    description = "DateTime field that encrypts/decrypts ISO-formatted strings."

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value

        try:
            decrypted = decrypt(value.encode())
            return datetime.datetime.fromisoformat(decrypted)
        except Exception:
            # return raw value for legacy/plaintext/corrupt rows
            try:
                return datetime.datetime.fromisoformat(value)
            except Exception:
                return value

    def to_python(self, value):
        if value is None:
            return value

        # Already a datetime → no need to decrypt
        if isinstance(value, datetime.datetime):
            return value

        # Prevent double decryption
        try:
            decrypted = decrypt(value.encode())
            return datetime.datetime.fromisoformat(decrypted)
        except Exception:
            # Might already be plaintext ISO
            try:
                return datetime.datetime.fromisoformat(value)
            except Exception:
                return value

    def get_prep_value(self, value):
        if value is None:
            return None

        # Must be datetime before encrypting
        if isinstance(value, datetime.datetime):
            iso = value.isoformat()
        else:
            # Accept strings for convenience
            iso = str(value)

        try:
            encrypted = encrypt(iso)
            return encrypted.decode()
        except Exception:
            return iso

