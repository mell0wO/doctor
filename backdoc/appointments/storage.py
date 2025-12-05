from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile
from utils.crypto import encrypt_bytes, decrypt_bytes


class EncryptedFileSystemStorage(FileSystemStorage):
    """
    Stores files encrypted. Decrypts automatically when reading.
    """

    def _save(self, name, content):
        if hasattr(content, 'open'):
            content.open()

        data = content.read()
        encrypted = encrypt_bytes(data)
        return super()._save(name, ContentFile(encrypted))

    def _open(self, name, mode='rb'):
        f = super()._open(name, mode)
        encrypted = f.read()
        decrypted = decrypt_bytes(encrypted)
        return ContentFile(decrypted)
