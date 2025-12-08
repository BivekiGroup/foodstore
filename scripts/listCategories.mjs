import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'no2bchw8',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
})

async function listCategories() {
  try {
    console.log('🔍 Получение списка всех категорий...\n')

    const categories = await client.fetch(
      `*[_type == "category"]{_id, name} | order(name asc)`
    )

    if (categories.length === 0) {
      console.log('❌ Категории не найдены')
      return
    }

    console.log(`✅ Найдено категорий: ${categories.length}\n`)
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (ID: ${cat._id})`)
    })

    // Теперь получим количество товаров в каждой категории
    console.log('\n📊 Количество товаров по категориям:\n')

    for (const category of categories) {
      const products = await client.fetch(
        `*[_type == "product" && category._ref == $catId]`,
        { catId: category._id }
      )
      console.log(`  ${category.name}: ${products.length} товаров`)
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    throw error
  }
}

listCategories()
  .then(() => {
    console.log('\n✅ Готово!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Критическая ошибка:', error)
    process.exit(1)
  })
