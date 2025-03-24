using Project.Models;

public class ShopeeViewModel
{
    public IEnumerable<Store> Stores { get; set; }
    public IEnumerable<Store> Store { get; set; }
    public IEnumerable<Product> Products {get; set;}
    public IEnumerable<Favorite> Favorites { get; set; }
    public IEnumerable<ParentCategory> ParentCategories { get; set; }
    public IEnumerable<Category> Categories {get; set;}
    public IEnumerable<CartDetail> CartDetails { get; set; }
    public IEnumerable<User> Users { get; set; }
    public IEnumerable<User> User { get; set; }
    public IEnumerable<Order> Order { get; set; }
    public IEnumerable<UserInfo> UserInfos { get; set; }
    public IEnumerable<UserInfo> UserInfo { get; set; }
    public IEnumerable<Checkout> Checkouts { get; set; }
    public IEnumerable<Chat> Chats { get; set; }
    public IEnumerable<Address> Address { get; set; }
    public IEnumerable<ShippingOrder> ShippingOrder { get; set; }
    public int UserID { get; set; }
    public string Username { get; set; }
    public int TotalPage { get; set; }
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int CurrentCategoryID { get; set; }
    public int CurrentProductID { get; set; }
    public int CartCount { get; set; }
    public int RoleID { get; set; }
    public Status Status { get; set; }
    public int OrderID { get; set; }
}