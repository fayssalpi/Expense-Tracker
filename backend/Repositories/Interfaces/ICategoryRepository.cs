using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface ICategoryRepository
    {

        Task<IEnumerable<Category>> GetAllCategories();
        Task<Category> GetCategoryById(int id);
        Task AddCategory(Category category);
        Task UpdateCategory(Category category);
        Task DeleteCategory(int id);
        Task<IEnumerable<Category>> GetCategoriesByUserId(int userId);
        Task<Category> GetCategoryByNameAndUserId(string name, int userId);


    }
}
