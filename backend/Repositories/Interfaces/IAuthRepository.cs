using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<bool> UserExists(string username);
        Task Register(User user);
        Task<User> Login(string username);
    }
}
