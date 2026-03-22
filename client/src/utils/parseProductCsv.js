/**
 * Parse one CSV line with quoted fields (RFC-style "double quote" escaping).
 */
export function parseCsvLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i]
    const next = line[i + 1]
    if (c === '"') {
      if (inQuotes && next === '"') {
        cur += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (c === ',' && !inQuotes) {
      out.push(cur.trim())
      cur = ''
    } else {
      cur += c
    }
  }
  out.push(cur.trim())
  return out
}

function headerIndex(header, aliases) {
  const h = header.map((x) => String(x).trim().toLowerCase())
  for (const alias of aliases) {
    const idx = h.indexOf(alias.toLowerCase())
    if (idx !== -1) return idx
  }
  return -1
}

function resolveCategoryId(raw, categories) {
  const v = String(raw ?? '').trim()
  if (!v) {
    throw new Error('Category is empty')
  }
  if (/^[a-f\d]{24}$/i.test(v)) {
    return v
  }
  const found = categories.find((c) => c.name.trim().toLowerCase() === v.toLowerCase())
  if (!found) {
    throw new Error(`Unknown category "${v}". Use a category name from your catalog or a valid category ID.`)
  }
  return found.id
}

/**
 * Parse admin CSV: columns name, price, category (MongoDB id or category name), stock (optional),
 * description (optional), imageUrl or images (optional; images = pipe-separated URLs).
 */
export function parseProductCsv(text, categories) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) {
    throw new Error('CSV must include a header row and at least one data row.')
  }

  const header = parseCsvLine(lines[0])
  const nameIdx = headerIndex(header, ['name', 'product name', 'title'])
  const priceIdx = headerIndex(header, ['price', 'amount'])
  const categoryIdx = headerIndex(header, ['category', 'category id', 'category_id'])
  const stockIdx = headerIndex(header, ['stock', 'quantity', 'qty'])
  const descIdx = headerIndex(header, ['description', 'desc'])
  const imageUrlIdx = headerIndex(header, ['imageurl', 'image_url', 'image', 'primary image'])
  const imagesIdx = headerIndex(header, ['images', 'image urls'])

  if (nameIdx === -1 || priceIdx === -1 || categoryIdx === -1) {
    throw new Error('CSV must include columns: name, price, and category (category id or category name).')
  }

  const products = []
  const parseErrors = []

  for (let r = 1; r < lines.length; r += 1) {
    const line = lines[r].trim()
    if (!line) continue
    const rowNum = r + 1
    try {
      const cells = parseCsvLine(line)
      const name = (cells[nameIdx] ?? '').trim()
      if (!name) {
        throw new Error('Name is empty')
      }
      const priceRaw = (cells[priceIdx] ?? '').trim()
      const price = Number(priceRaw)
      if (!Number.isFinite(price) || price < 0) {
        throw new Error(`Invalid price "${priceRaw}"`)
      }
      const categoryId = resolveCategoryId(cells[categoryIdx], categories)

      let stock = 0
      if (stockIdx !== -1 && cells[stockIdx] != null && String(cells[stockIdx]).trim() !== '') {
        const s = Number(String(cells[stockIdx]).trim())
        if (!Number.isFinite(s) || s < 0 || !Number.isInteger(s)) {
          throw new Error(`Invalid stock "${cells[stockIdx]}"`)
        }
        stock = s
      }

      let description = ''
      if (descIdx !== -1 && cells[descIdx] != null) {
        description = String(cells[descIdx]).trim()
      }

      const images = []
      if (imagesIdx !== -1 && cells[imagesIdx] != null && String(cells[imagesIdx]).trim()) {
        String(cells[imagesIdx])
          .split('|')
          .map((u) => u.trim())
          .filter(Boolean)
          .forEach((u) => images.push(u))
      }
      if (imageUrlIdx !== -1 && cells[imageUrlIdx] != null && String(cells[imageUrlIdx]).trim()) {
        const single = String(cells[imageUrlIdx]).trim()
        if (!images.includes(single)) images.unshift(single)
      }

      products.push({
        name,
        price,
        category: categoryId,
        stock,
        description,
        images,
      })
    } catch (e) {
      parseErrors.push({ row: rowNum, message: e.message || 'Invalid row' })
    }
  }

  return { products, parseErrors }
}

export const PRODUCT_CSV_TEMPLATE = `name,price,category,stock,description,imageUrl
"Example Saree",1299,Clothing,10,"Optional description",https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80`
