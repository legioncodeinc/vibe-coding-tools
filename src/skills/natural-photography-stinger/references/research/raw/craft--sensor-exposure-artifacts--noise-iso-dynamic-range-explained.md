# Noise, ISO and Dynamic Range Explained (PhotoPXL / Luminous Landscape)
- URL: https://photopxl.com/noise-iso-and-dynamic-range-explained/
- Fetched: 2026-08-17
- Source type: technical

## The governing physics
- **Photon (shot) noise dominates** in modern cameras. It is not a defect — it is the Poisson statistics of light itself.
- `SNR_photon = signal / std.dev = lambda / sqrt(lambda) = sqrt(lambda)`
  So **SNR rises with the square root of the number of photons captured.** Collect 4x the light -> 2x the SNR -> 1 stop cleaner.
- Sensor electronic (read) noise matters only near the bottom of the range. Crossover point: `SNR_photon = SNR_electronic` at `lambda* = sigma_sensor^2`.

## Measured example: Sony A7R III (dual conversion gain)
| Parameter | Low-gain state | High-gain state |
|---|---|---|
| Full well capacity | **48,500 photons** | **7,600 photons** |
| Sensor electronic noise (sigma_sensor) | **3.3 photons** | **1.01 photons** |
| Base ISO for that state | **ISO 100** | **ISO 640** |
| Engineering dynamic range | **13.8 stops** | **12.2 stops** |

- The dual-gain switch at ISO 640 is why many cameras get *cleaner* shadows at ISO 640 than at ISO 500.

## Practical dynamic range
- Perceptual/push-based assessment: acceptable quality up to **ISO 6400–25,600**, with roughly **6 stops of shadow recovery at base ISO**, yielding a usable DR around **12–13 stops** on a modern full-frame body.
- The article argues SNR-threshold DR definitions are arbitrary and prefers this perceptual approach.

## Craft implication
Because SNR = sqrt(photons), and a phone pixel is ~1.5 µm vs a full-frame ~4 µm (≈7x the area), the phone is roughly **2.5–3 stops noisier per pixel** at the same scene light before any processing. That deficit is what noise reduction hides — and the hiding is the visible artifact.
