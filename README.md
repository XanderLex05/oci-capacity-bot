# OCI Capacity Bot

Busca capacidad para una instancia **VM.Standard.A1.Flex** en Oracle Cloud y crea una sola instancia cuando encuentra disponibilidad.

## Cómo funciona

- Se ejecuta automáticamente cada 5 minutos mediante GitHub Actions.
- Comprueba primero si la instancia objetivo ya existe.
- Revisa todos los Availability Domains configurados.
- Si encuentra capacidad, intenta lanzar una única VM.
- Si la VM se crea correctamente, el workflow intenta deshabilitarse solo.

## Secrets requeridos

En **Settings → Secrets and variables → Actions → New repository secret** crea:

- `OCI_PRIVATE_KEY`: clave privada PEM de la API de OCI.
- `SSH_PUBLIC_KEY`: clave SSH pública que se instalará en la VM.
- `OCI_BOT_CONFIG`: JSON con los parámetros de OCI.

Formato de `OCI_BOT_CONFIG`:

```json
{
  "user_ocid": "...",
  "fingerprint": "...",
  "tenancy_ocid": "...",
  "region": "us-ashburn-1",
  "compartment_ocid": "...",
  "subnet_ocid": "...",
  "image_ocid": "...",
  "availability_domains": [
    "...AD-1",
    "...AD-2",
    "...AD-3"
  ],
  "instance_name": "jarvis-server",
  "shape": "VM.Standard.A1.Flex",
  "ocpus": 1,
  "memory_gb": 6
}
```

> Nunca guardes la clave privada directamente en archivos públicos del repositorio.
