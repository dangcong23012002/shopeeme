using Project.Models;

public class CheckoutViewModel
{
    public List<Checkout> Checkouts { get; set ;}
    public List<Address> Addresses { get; set; }
    public List<City> Cities { get; set; }
    public List<District> Districts { get; set; }
    public List<AddressChoose> AddressChooses { get; set; }
    public List<User> Users { get; set; }
    public List<UserInfo> UserInfos { get; set; }
    public List<Payment> PaymentTypes { get; set; }
    public IEnumerable<Product> Product { get; set; }
    public Status Status { get; set;}
    public Order Order { get; set; }
    public int OrderID { get; set; }
    public int ShopID { get; set; }
    public int ProductCount { get; set; }
    public double TotalPrice { get; set; }
    public int Quantity { get; set; }
}