import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'no2bchw8',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '', // Нужен токен с правами на запись
})

async function deleteProductsByCategories(categoryIds) {
  try {
    console.log('🔍 Поиск категорий по ID:', categoryIds)

    // Получаем категории по ID
    const categories = await client.fetch(
      `*[_type == "category" && _id in $ids]{_id, name}`,
      { ids: categoryIds }
    )

    if (categories.length === 0) {
      console.log('❌ Категории не найдены')
      return
    }

    console.log('✅ Найдено категорий:', categories.length)
    categories.forEach(cat => console.log(`  - ${cat.name} (${cat._id})`))

    const foundCategoryIds = categories.map(c => c._id)

    // Получаем все товары из этих категорий
    const products = await client.fetch(
      `*[_type == "product" && category._ref in $categoryIds]{_id, name, category->{name}}`,
      { categoryIds: foundCategoryIds }
    )

    console.log(`\n📦 Найдено товаров для удаления: ${products.length}`)

    if (products.length === 0) {
      console.log('❌ Товары не найдены')
      return
    }

    // Показываем список товаров
    console.log('\nСписок товаров для удаления:')
    products.forEach(product => {
      console.log(`  - ${product.name} (категория: ${product.category?.name || 'N/A'})`)
    })

    console.log('\n⚠️  ВНИМАНИЕ: Начинаем удаление через 3 секунды...')
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Удаляем товары
    let deletedCount = 0
    for (const product of products) {
      try {
        await client.delete(product._id)
        console.log(`✅ Удален: ${product.name}`)
        deletedCount++
      } catch (error) {
        console.error(`❌ Ошибка при удалении ${product.name}:`, error.message)
      }
    }

    console.log(`\n✅ Удаление завершено! Удалено товаров: ${deletedCount} из ${products.length}`)

  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    throw error
  }
}

// ID категорий для удаления
const categoriesToDelete = [
  '37f0fe20-afd6-47d8-86a7-dee4ef48f26e',  // Dried-fish - Вяленая рыба (12 товаров)
  'd1c54491-de71-48e6-affa-4d0aff7f5d5f',  // Cheese-butter - Сыры и масло (11 товаров)
]

deleteProductsByCategories(categoriesToDelete)
  .then(() => {
    console.log('\n🎉 Скрипт успешно выполнен!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Критическая ошибка:', error)
    process.exit(1)
  })
