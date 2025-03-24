using Microsoft.AspNetCore.Mvc;
using Project.Models.Domain;

public class SellerController : Controller
{
    private readonly IUserResponsitory _userResponsitory;
    private readonly ISellerResponsitory _sellerResponsitory;
    private readonly IShopResponsitory _shopResponsitory;
    private readonly IOrderResponsitory _orderResponsitory;
    private readonly IShippingOrderRepository _shippingOrderRepository;
    private readonly ICheckoutResponsitory _checkoutResponsitory;
    private readonly IHttpContextAccessor _accessor;
    private readonly ICategoryResponsitory _categoryResponsitory;
    private readonly IProductResponsitory _productResponsitory;
    private readonly IChatRepository _chatRepository;
    public SellerController(
        IHttpContextAccessor accessor, 
        IUserResponsitory userResponsitory, 
        ISellerResponsitory sellerResponsitory, 
        IShopResponsitory shopResponsitory, 
        IOrderResponsitory orderResponsitory, 
        IShippingOrderRepository shippingOrderRepository, 
        ICheckoutResponsitory checkoutResponsitory,
        ICategoryResponsitory categoryResponsitory,
        IProductResponsitory productResponsitory,
        IChatRepository chatRepository
        )
    {
        _accessor = accessor;
        _userResponsitory = userResponsitory;
        _sellerResponsitory = sellerResponsitory;
        _shopResponsitory = shopResponsitory;
        _orderResponsitory = orderResponsitory;
        _shippingOrderRepository = shippingOrderRepository;
        _checkoutResponsitory = checkoutResponsitory;
        _categoryResponsitory = categoryResponsitory;
        _productResponsitory = productResponsitory;
        _chatRepository = chatRepository;
    }

    [HttpGet]
    [Route("/seller")]
    public IActionResult Index() {
        return View();
    }

    [HttpGet]
    [Route("/seller-data/{sellerID?}")]
    public IActionResult GetData(int sellerID = 0) {
        System.Console.WriteLine(sellerID);
        List<Store> store = _shopResponsitory.getShopBySellerID(sellerID).ToList();
        List<SellerInfo> sellerInfo = _sellerResponsitory.getSellerInfoBySellerID(sellerID).ToList();
        Status status;
        int storeID = 0;
        if (store.Count() == 0 && sellerInfo.Count() == 0) {
            status = new Status {
                StatusCode = -1,
                Message = "Tài khoản chưa đầy đủ thông tin!"
            };
            storeID = 0;
        } else {
            status = new Status {
                StatusCode = 1,
                Message = "Tài khoản đầy đủ thông tin!"
            };
            storeID = store[0].PK_iStoreID;
        }
        IEnumerable<Order> ordersWaitSettlement = _orderResponsitory.getOrderWaitSettlementByShopID(storeID);
        IEnumerable<Order> ordersWaitPickup = _orderResponsitory.getOrderWaitPickupByShopID(storeID);
        IEnumerable<ShippingOrder> shippingOrders = _shippingOrderRepository.getShippingOrderByShopID(storeID);
        IEnumerable<CategoryModel> categories = _categoryResponsitory.getAllCategoriesByShopID(storeID);
        IEnumerable<Discount> discounts = _productResponsitory.getDiscounts();
        IEnumerable<TransportPrice> transportPrices = _productResponsitory.getTransportPrice();
        IEnumerable<Product> products = _shopResponsitory.getProductsByShopID(storeID);
        IEnumerable<MakeFriend> makeFriends = _chatRepository.getMakeFriendBySellerID(storeID);
        IEnumerable<Chat> chats = _chatRepository.getChatBySellerID(storeID);
        string htmlOrdersWaitSettlmentItem = "";
        string htmlOrdersWaitPickupItem = "";
        foreach (var item in ordersWaitSettlement) {
            htmlOrdersWaitSettlmentItem += $" <div class='admin__order-table-body-row'>";
            htmlOrdersWaitSettlmentItem += $"     <div class='admin__order-table-body-col'>{item.PK_iOrderID}</div>";
            htmlOrdersWaitSettlmentItem += $"     <div class='admin__order-table-body-col'>{item.sFullName}</div>";
            htmlOrdersWaitSettlmentItem += $"     <div class='admin__order-table-body-col'>{item.dDate.ToString("dd/MM/yyyy")}</div>";
            htmlOrdersWaitSettlmentItem += $"     <div class='admin__order-table-body-col'>{item.fTotalPrice.ToString("#,##0.00")}VND</div>"; // Đặt tiền: https://www.phanxuanchanh.com/2021/10/26/dinh-dang-tien-te-trong-c/
            htmlOrdersWaitSettlmentItem += $"     <div class='admin__order-table-body-col'>{item.sOrderStatusName}</div>";
            htmlOrdersWaitSettlmentItem += $"     <div class='admin__order-table-body-col payment'>";
            htmlOrdersWaitSettlmentItem += $"            <div class='admin__order-table-body-col-payment-name'>{item.sPaymentName}</div>";
            htmlOrdersWaitSettlmentItem += $"     </div>";
            htmlOrdersWaitSettlmentItem += $"     <div class='admin__order-table-body-col primary'>";
            htmlOrdersWaitSettlmentItem += $"         30:00";
            htmlOrdersWaitSettlmentItem += $"     </div>";
            htmlOrdersWaitSettlmentItem += $" </div>";
        }

        foreach (var item in ordersWaitPickup) {
            htmlOrdersWaitPickupItem += $" <div class='admin__order-table-body-row'>";
            htmlOrdersWaitPickupItem += $"     <div class='admin__order-table-body-col'>{item.PK_iOrderID}</div>";
            htmlOrdersWaitPickupItem += $"     <div class='admin__order-table-body-col'>{item.sFullName}</div>";
            htmlOrdersWaitPickupItem += $"     <div class='admin__order-table-body-col'>{item.dDate.ToString("dd/MM/yyyy")}</div>";
            htmlOrdersWaitPickupItem += $"     <div class='admin__order-table-body-col'>{item.fTotalPrice.ToString("#,##0.00")}VND</div>"; // Đặt tiền: https://www.phanxuanchanh.com/2021/10/26/dinh-dang-tien-te-trong-c/
            htmlOrdersWaitPickupItem += $"     <div class='admin__order-table-body-col'>{item.sOrderStatusName}</div>";
            htmlOrdersWaitPickupItem += $"     <div class='admin__order-table-body-col payment'>";
            htmlOrdersWaitPickupItem += $"            <div class='admin__order-table-body-col-payment-name'>{item.sPaymentName}</div>";
            htmlOrdersWaitPickupItem += $"     </div>";
            htmlOrdersWaitPickupItem += $"     <div class='admin__order-table-body-col primary'>";
            htmlOrdersWaitPickupItem += $"         <a href='javascript:prepareGoodModal({item.PK_iOrderID}, {item.FK_iUserID})' class='admin__order-table-body-col-link'>Chuẩn bị hàng</a>";
            htmlOrdersWaitPickupItem += $"     </div>";
            htmlOrdersWaitPickupItem += $" </div>";
        }

        string htmlOrdersProcessedItem = "";
        foreach (var item in shippingOrders)
        {
            htmlOrdersProcessedItem += $" <div class='admin__order-table-body-row'>";
            htmlOrdersProcessedItem += $"     <div class='admin__order-table-body-col'>{item.FK_iOrderID}</div>";
            htmlOrdersProcessedItem += $"     <div class='admin__order-table-body-col'>{item.sFullName}</div>";
            htmlOrdersProcessedItem += $"     <div class='admin__order-table-body-col'>{item.dDate.ToString("dd/MM/yyyy")}</div>";
            htmlOrdersProcessedItem += $"     <div class='admin__order-table-body-col'>{item.fTotalPrice.ToString("#,##0.00")}VND</div>"; // Đặt tiền: https://www.phanxuanchanh.com/2021/10/26/dinh-dang-tien-te-trong-c/
            htmlOrdersProcessedItem += $"     <div class='admin__order-table-body-col'>{item.sOrderStatusName}</div>";
            htmlOrdersProcessedItem += $"     <div class='admin__order-table-body-col payment'>";
            htmlOrdersProcessedItem += $"            <div class='admin__order-table-body-col-payment-name'>{item.sPaymentName}</div>";
            htmlOrdersProcessedItem += $"     </div>";
            htmlOrdersProcessedItem += $"     <div class='admin__order-table-body-col primary'>";
            htmlOrdersProcessedItem += $"         <a href='/seller/delivery-note/{item.FK_iOrderID}' class='admin__order-table-body-col-link'>Xem phiếu giao</a>";
            htmlOrdersProcessedItem += $"     </div>";
            htmlOrdersProcessedItem += $" </div>";
        }
        string htmlProductItem = "";
        foreach (var item in products) {
            htmlProductItem += $"    <div class='admin__product-item'>";
            htmlProductItem += $"        <div class='admin__product-item-input'>";
            htmlProductItem += $"            <input type='checkbox' class='admin__product-item-input-checkbox'>";
            htmlProductItem += $"        </div>";
            htmlProductItem += $"        <div class='admin__product-item-info'>";
            htmlProductItem += $"           <div class='admin__product-item-img' style='background-image: url(/img/{item.sImageUrl});'></div>";
            htmlProductItem += $"           <div class='admin__product-item-desc'>";
            htmlProductItem += $"               <div class='admin__product-item-name'>{item.sProductName}";
            htmlProductItem += $"                   <div class='cart__body-product-name-progress'>";
            htmlProductItem += $"                       <div class='cart__body-product-name-progress-line'></div>";
            htmlProductItem += $"                       <div class='cart__body-product-name-progress-line'></div>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"               </div>";
            htmlProductItem += $"               <img src='/img/voucher.png' class='admin__product-item-voucher' alt=''>";
            htmlProductItem += $"           </div>";
            htmlProductItem += $"       </div>";
            htmlProductItem += $"       <div class='admin__product-item-type'>{item.sCategoryName}</div>";
            htmlProductItem += $"       <div class='admin__product-item-cre-time'>{item.dCreateTime.ToString("dd/MM/yyyy")}</div>";
            htmlProductItem += $"       <div class='admin__product-item-update-time'>{item.dUpdateTime.ToString("dd/MM/yyyy")}</div>";
            htmlProductItem += $"       <div class='admin__product-item-qnt'>{item.iQuantity}</div>";
            htmlProductItem += $"       <div class='admin__product-item-operation'>";
            htmlProductItem += $"           <div class='admin-tool__more'>";
            htmlProductItem += $"               <i class='uil uil-ellipsis-v admin-tool__more-icon'></i>";
            htmlProductItem += $"               <div class='admin-tool__more-container'>";
            htmlProductItem += $"                   <div class='admin-tool__more-item' onclick='openUpdateProduct({item.PK_iProductID})'>";
            htmlProductItem += $"                       <i class='uil uil-pen admin-tool__more-item-icon'></i>";
            htmlProductItem += $"                       <span>Chỉnh sửa</span>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"                   <div class='admin-tool__more-item' onclick='openDeleteProduct({item.PK_iProductID})'>";
            htmlProductItem += $"                       <i class='uil uil-trash admin-tool__more-item-icon'></i>";
            htmlProductItem += $"                       <span>Xoá</span>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"               </div>";
            htmlProductItem += $"           </div>";
            htmlProductItem += $"       </div>";
            htmlProductItem += $"   </div>";
        }

        SellerViewModel model = new SellerViewModel {
            Status = status,
            SellerID = sellerID,
            SellerInfo = sellerInfo,
            OrdersWaitSettlement = ordersWaitSettlement,
            OrdersWaitPickup = ordersWaitPickup,
            OrdersProcessed = shippingOrders,
            HtmlOrdersWaitSettlementItem = htmlOrdersWaitSettlmentItem,
            HtmlOrdersWaitPickupItem = htmlOrdersWaitPickupItem,
            HtmlOrdersProcessedItem = htmlOrdersProcessedItem,
            ShippingOrders = shippingOrders,
            Categories = categories,
            Discounts = discounts,
            TransportPrices = transportPrices,
            Products = products,
            HtmlProductItem = htmlProductItem,
            MakeFriends = makeFriends,
            Chats = chats,
            CurrentTime = DateTime.Now,
            TotalOrderAmount = shippingOrders.Sum(p => p.fTotalPrice),
            TotalPaymentRefund = 0
        };
        return Ok(model);
    }

    [HttpGet]
    [Route("/seller/product-detail/{productID}")]
    public IActionResult ProductDetailAPI(int productID = 0) {
        List<Product> products = _productResponsitory.getProductByID(productID).ToList();
        IEnumerable<CategoryModel> categories = _categoryResponsitory.getAllCategoriesByShopID(products[0].FK_iStoreID);
        IEnumerable<Discount> discounts = _productResponsitory.getDiscounts();
        IEnumerable<TransportPrice> transportPrices = _productResponsitory.getTransportPrice();
        SellerViewModel model = new SellerViewModel
        {
            Categories = categories,
            Discounts = discounts,
            TransportPrices = transportPrices,
            Products = products
        };
        return Ok(model);
    }

    [HttpPost]
    [Route("/seller/update-product")]
    public IActionResult UpdateProduct(int shopID = 0, int productID = 0, int categoryID = 0, int discountID = 0, int transportID = 0, string productName = "", int quantity = 0, string productDesc = "", string imageUrl = "", double price = 0) {
        _productResponsitory.updateProduct(productID, shopID, categoryID, discountID, transportID, productName, quantity, productDesc, imageUrl, price);
        Status status = new Status {
            StatusCode = 1,
            Message = "Cập nhật sản phẩm thành công"
        };
        IEnumerable<Product> products = _shopResponsitory.getProductsByShopID(shopID);
        string htmlProductItem = "";
        foreach (var item in products) {
            htmlProductItem += $"    <div class='admin__product-item'>";
            htmlProductItem += $"        <div class='admin__product-item-input'>";
            htmlProductItem += $"            <input type='checkbox' class='admin__product-item-input-checkbox'>";
            htmlProductItem += $"        </div>";
            htmlProductItem += $"        <div class='admin__product-item-info'>";
            htmlProductItem += $"           <div class='admin__product-item-img' style='background-image: url(/img/{item.sImageUrl});'></div>";
            htmlProductItem += $"           <div class='admin__product-item-desc'>";
            htmlProductItem += $"               <div class='admin__product-item-name'>{item.sProductName}";
            htmlProductItem += $"                   <div class='cart__body-product-name-progress'>";
            htmlProductItem += $"                       <div class='cart__body-product-name-progress-line'></div>";
            htmlProductItem += $"                       <div class='cart__body-product-name-progress-line'></div>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"               </div>";
            htmlProductItem += $"               <img src='/img/voucher.png' class='admin__product-item-voucher' alt=''>";
            htmlProductItem += $"           </div>";
            htmlProductItem += $"       </div>";
            htmlProductItem += $"       <div class='admin__product-item-type'>{item.sCategoryName}</div>";
            htmlProductItem += $"       <div class='admin__product-item-cre-time'>{item.dCreateTime.ToString("dd/MM/yyyy")}</div>";
            htmlProductItem += $"       <div class='admin__product-item-update-time'>{item.dUpdateTime.ToString("dd/MM/yyyy")}</div>";
            htmlProductItem += $"       <div class='admin__product-item-qnt'>{item.iQuantity}</div>";
            htmlProductItem += $"       <div class='admin__product-item-operation'>";
            htmlProductItem += $"           <div class='admin-tool__more'>";
            htmlProductItem += $"               <i class='uil uil-ellipsis-v admin-tool__more-icon'></i>";
            htmlProductItem += $"               <div class='admin-tool__more-container'>";
            htmlProductItem += $"                   <div class='admin-tool__more-item' onclick='openUpdateProduct({item.PK_iProductID})'>";
            htmlProductItem += $"                       <i class='uil uil-pen admin-tool__more-item-icon'></i>";
            htmlProductItem += $"                       <span>Chỉnh sửa</span>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"                   <div class='admin-tool__more-item' onclick='openDeleteProduct({item.PK_iProductID})'>";
            htmlProductItem += $"                       <i class='uil uil-trash admin-tool__more-item-icon'></i>";
            htmlProductItem += $"                       <span>Xoá</span>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"               </div>";
            htmlProductItem += $"           </div>";
            htmlProductItem += $"       </div>";
            htmlProductItem += $"   </div>";
        }
        SellerViewModel model = new SellerViewModel {
            Status = status,
            Products = products,
            HtmlProductItem = htmlProductItem
        };
        return Ok(model);
    }

    [HttpPost]
    [Route("/seller/add-product")]
    public IActionResult AddProduct(int categoryID = 0, int discountID = 0, int transportID = 0, string productName = "", int quantity = 0, string productDesc = "", string imageUrl = "", double price = 0) {
        var sessionShopID = _accessor?.HttpContext?.Session.GetInt32("SellerShopID");
        _productResponsitory.insertProduct(Convert.ToInt32(sessionShopID), categoryID, discountID, transportID, productName, quantity, productDesc, imageUrl, price);
        Status status = new Status {
            StatusCode = 1,
            Message = "Thêm sản phẩm thành công!"
        };
        List<Product> product = _productResponsitory.searchProductByKeyword(productName).ToList();
        IEnumerable<Product> products = _shopResponsitory.getProductsByShopID(Convert.ToInt32(sessionShopID));
        string htmlProductItem = "";
        foreach (var item in products) {
            htmlProductItem += $"    <div class='admin__product-item'>";
            htmlProductItem += $"        <div class='admin__product-item-input'>";
            htmlProductItem += $"            <input type='checkbox' class='admin__product-item-input-checkbox'>";
            htmlProductItem += $"        </div>";
            htmlProductItem += $"        <div class='admin__product-item-info'>";
            htmlProductItem += $"           <div class='admin__product-item-img' style='background-image: url(/img/{item.sImageUrl});'></div>";
            htmlProductItem += $"           <div class='admin__product-item-desc'>";
            htmlProductItem += $"               <div class='admin__product-item-name'>{item.sProductName}";
            htmlProductItem += $"                   <div class='cart__body-product-name-progress'>";
            htmlProductItem += $"                       <div class='cart__body-product-name-progress-line'></div>";
            htmlProductItem += $"                       <div class='cart__body-product-name-progress-line'></div>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"               </div>";
            htmlProductItem += $"               <img src='/img/voucher.png' class='admin__product-item-voucher' alt=''>";
            htmlProductItem += $"           </div>";
            htmlProductItem += $"       </div>";
            htmlProductItem += $"       <div class='admin__product-item-type'>{item.sCategoryName}</div>";
            htmlProductItem += $"       <div class='admin__product-item-cre-time'>{item.dCreateTime.ToString("dd/MM/yyyy")}</div>";
            htmlProductItem += $"       <div class='admin__product-item-update-time'>{item.dUpdateTime.ToString("dd/MM/yyyy")}</div>";
            htmlProductItem += $"       <div class='admin__product-item-qnt'>{item.iQuantity}</div>";
            htmlProductItem += $"       <div class='admin__product-item-operation'>";
            htmlProductItem += $"           <div class='admin-tool__more'>";
            htmlProductItem += $"               <i class='uil uil-ellipsis-v admin-tool__more-icon'></i>";
            htmlProductItem += $"               <div class='admin-tool__more-container'>";
            htmlProductItem += $"                   <div class='admin-tool__more-item' onclick='openUpdateProduct({item.PK_iProductID})'>";
            htmlProductItem += $"                       <i class='uil uil-pen admin-tool__more-item-icon'></i>";
            htmlProductItem += $"                       <span>Chỉnh sửa</span>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"                   <div class='admin-tool__more-item' onclick='openDeleteProduct({item.PK_iProductID})'>";
            htmlProductItem += $"                       <i class='uil uil-trash admin-tool__more-item-icon'></i>";
            htmlProductItem += $"                       <span>Xoá</span>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"               </div>";
            htmlProductItem += $"           </div>";
            htmlProductItem += $"       </div>";
            htmlProductItem += $"   </div>";
        }
        SellerViewModel model = new SellerViewModel {
            Status = status,
            Products = products,
            HtmlProductItem = htmlProductItem,
            NewCreatedProductID = product[0].PK_iProductID
        };
        return Ok(model);
    }

    [HttpPost]
    [Route("/seller/delete-product")]
    public IActionResult DeleteProduct(int productID = 0) {
        Status status;
        List<Product> checkProductInCart = _productResponsitory.checkProductInCart(productID).ToList();
        List<Product> checkProductInOrder = _productResponsitory.checkProductInOrder(productID).ToList();
        if (checkProductInCart.Count() != 0 || checkProductInOrder.Count() != 0) {
            status = new Status {
                StatusCode = -1,
                Message = "Sản phẩm đang liên quan tới dữ liệu khác, không thể xoá!"
            };
        } else {
            _productResponsitory.deleteProductByID(productID);
            status = new Status {
                StatusCode = 1,
                Message = "Xoá sản phẩm thành công"
            };
        }
        var sessionShopID = _accessor?.HttpContext?.Session.GetInt32("SellerShopID");
        IEnumerable<Product> products = _shopResponsitory.getProductsByShopID(Convert.ToInt32(sessionShopID));
        string htmlProductItem = "";
        foreach (var item in products) {
            htmlProductItem += $"    <div class='admin__product-item'>";
            htmlProductItem += $"        <div class='admin__product-item-input'>";
            htmlProductItem += $"            <input type='checkbox' class='admin__product-item-input-checkbox'>";
            htmlProductItem += $"        </div>";
            htmlProductItem += $"        <div class='admin__product-item-info'>";
            htmlProductItem += $"           <div class='admin__product-item-img' style='background-image: url(/img/{item.sImageUrl});'></div>";
            htmlProductItem += $"           <div class='admin__product-item-desc'>";
            htmlProductItem += $"               <div class='admin__product-item-name'>{item.sProductName}";
            htmlProductItem += $"                   <div class='cart__body-product-name-progress'>";
            htmlProductItem += $"                       <div class='cart__body-product-name-progress-line'></div>";
            htmlProductItem += $"                       <div class='cart__body-product-name-progress-line'></div>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"               </div>";
            htmlProductItem += $"               <img src='/img/voucher.png' class='admin__product-item-voucher' alt=''>";
            htmlProductItem += $"           </div>";
            htmlProductItem += $"       </div>";
            htmlProductItem += $"       <div class='admin__product-item-type'>{item.sCategoryName}</div>";
            htmlProductItem += $"       <div class='admin__product-item-cre-time'>{item.dCreateTime.ToString("dd/MM/yyyy")}</div>";
            htmlProductItem += $"       <div class='admin__product-item-update-time'>{item.dUpdateTime.ToString("dd/MM/yyyy")}</div>";
            htmlProductItem += $"       <div class='admin__product-item-qnt'>{item.iQuantity}</div>";
            htmlProductItem += $"       <div class='admin__product-item-operation'>";
            htmlProductItem += $"           <div class='admin-tool__more'>";
            htmlProductItem += $"               <i class='uil uil-ellipsis-v admin-tool__more-icon'></i>";
            htmlProductItem += $"               <div class='admin-tool__more-container'>";
            htmlProductItem += $"                   <div class='admin-tool__more-item' onclick='openUpdateProduct({item.PK_iProductID})'>";
            htmlProductItem += $"                       <i class='uil uil-pen admin-tool__more-item-icon'></i>";
            htmlProductItem += $"                       <span>Chỉnh sửa</span>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"                   <div class='admin-tool__more-item' onclick='openDeleteProduct({item.PK_iProductID})'>";
            htmlProductItem += $"                       <i class='uil uil-trash admin-tool__more-item-icon'></i>";
            htmlProductItem += $"                       <span>Xoá</span>";
            htmlProductItem += $"                   </div>";
            htmlProductItem += $"               </div>";
            htmlProductItem += $"           </div>";
            htmlProductItem += $"       </div>";
            htmlProductItem += $"   </div>";
        }
        SellerViewModel model = new SellerViewModel {
            Status = status,
            Products = products,
            HtmlProductItem = htmlProductItem
        };
        return Ok(model);
    }

    [HttpPost]
    [Route("/seller/add-chat")]
    public IActionResult AddChat(int sellerID = 0, int chatID = 0, string msg = "") {
        int personID = sellerID;
        Status status;
        if (_chatRepository.insertChatDetail(chatID, personID, msg)) {
            status = new Status {
                StatusCode = 1,
                Message = "Thêm trò chuyện thành công!"
            };
        } else {
            status = new Status {
                StatusCode = -1,
                Message = "Thêm trò chuyện thất bại!"
            };
        }
        DataViewModel model = new DataViewModel {
            Status = status
        };
        return Ok(model);
    }

    [HttpGet]
    [Route("/seller/login")]
    public IActionResult Login() {
        return View();
    }

    [HttpPost]
    [Route("/seller/login")]
    public IActionResult Login(string phone = "", string password = "") {
        password = _userResponsitory.encrypt(password);
        List<Seller> sellerLogin = _sellerResponsitory.loginAccount(phone, password).ToList();
        List<SellerInfo> sellerInfo = _sellerResponsitory.getSellerInfoByPhone(phone).ToList();
        Status status;
        if (sellerLogin.Count() == 0) {
            status = new Status {
                StatusCode = -1,
                Message = "Tên đăng nhập hoặc mật khẩu không chính xác!"
            };
        } else if (sellerInfo.Count() == 0) {
            status = new Status {
                StatusCode = -2,
                Message = "Tài khoản người bán chưa đầy đủ thông tin!"
            };
        } else {
            status = new Status {
                StatusCode = 1,
                Message = "Đăng nhập thành công!"
            };
        }
        SellerViewModel model = new SellerViewModel {
            Status = status,
            Seller = sellerLogin,
            SellerInfo = sellerInfo
        };
        return Ok(model);
    }

    [HttpGet]
    [Route("/seller/register")]
    public IActionResult Register() {
        return View();
    }

    [HttpPost]
    [Route("/seller/register")]
    public IActionResult Register(string phone = "", string username = "", string password = "") {
        // phone = "0" + phone;
        Status status;
        if (_sellerResponsitory.registerAccountSeller(phone, username, _userResponsitory.encrypt(password))) {
            status = new Status {
                StatusCode = 1,
                Message = "Đăng ký tài khoản người bán thành công!"
            };
        } else {
            status = new Status {
                StatusCode = -1,
                Message = "Đăng ký tài khoản người bán thất bại!"
            };
        }
        List<Seller> sellers = _sellerResponsitory.getPasswordSellerAccountByPhone(phone).ToList();
        string value = sellers[0].PK_iSellerID.ToString();
        // Tạo cookies cho tài khoản người bán
        CookieOptions options = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(1),
            Secure = true,
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            IsEssential = true
        };
        Response.Cookies.Append("SellerID", value, options);
        SellerViewModel model = new SellerViewModel {
            Status = status
        };
        return Ok(model);
    }

    [HttpPost]
    [Route("/seller/check-phone-regis")]
    public IActionResult PhoneRegis(string phone) {
        List<Seller> sellers = _sellerResponsitory.getPasswordSellerAccountByPhone(phone).ToList();
        Status status;
        if (sellers.Count() != 0) {
            status = new Status {
                StatusCode = 0,
                Message = "Số điện thoại này đã được đăng ký!"
            };
        } else {
            status = new Status {
                StatusCode = 1,
                Message = "Số điện thoại này chưa được đăng ký!"
            };
        }
        return Ok(status);
    }

    [HttpGet]
    [Route("/seller/portal")]
    public IActionResult Portal() {
        return View();
    }

    [HttpGet]
    [Route("/seller/portal-api/{sellerID?}")]
    public IActionResult PortalAPI(int sellerID = 0) {
        List<SellerInfo> sellerInfo = _sellerResponsitory.getSellerInfoBySellerID(sellerID).ToList();
        SellerViewModel model = new SellerViewModel {
            SellerInfo = sellerInfo
        };
        return Ok(model);
    }

    [HttpGet]
    [Route("/seller/forgot")]
    public IActionResult Forgot() {
        return View();
    }

    [HttpPost]
    [Route("/seller/forgot")]
    public IActionResult Forgot(string phone = "") {
        List<Seller> seller = _sellerResponsitory.getPasswordSellerAccountByPhone(phone).ToList();
        Status status;
        if (seller.Count() == 0) {
            status = new Status {
                StatusCode = -1,
                Message = "Không tồn tại số điện thoại!"
            };
        } else {
            string sellerPassword = _userResponsitory.decrypt(seller[0].sSellerPassword);
            status = new Status {
                StatusCode = 1,
                Message = $"Mật khẩu tài khoản của bạn: {sellerPassword}"
            };
        }
        SellerViewModel model = new SellerViewModel {
            Status = status
        };
        return Ok(model);
    }

    [HttpGet]
    [Route("/seller/change")]
    public IActionResult Change() {
        return View();
    }

    [HttpPost]
    [Route("/seller/change")]
    public IActionResult Change(string oldPassword = "", string newPassword = "") {
        oldPassword = _userResponsitory.encrypt(oldPassword);
        newPassword = _userResponsitory.encrypt(newPassword);
        var sessionSellerID = _accessor?.HttpContext?.Session.GetInt32("SellerID");
        List<Seller> sellerLogin = _sellerResponsitory.checkSellerAccountByIDAndPass(Convert.ToInt32(sessionSellerID), oldPassword).ToList();
        Status status;
        if (sellerLogin.Count() == 0)
        {
            status = new Status
            {
                StatusCode = -1,
                Message = "Mật khẩu cũ không chính xác!"
            };
        }
        else
        {
            _sellerResponsitory.changePasswordSellerAccount(Convert.ToInt32(sessionSellerID), newPassword);
            status = new Status
            {
                StatusCode = 1,
                Message = "Đổi mật khẩu thành công!"
            };
        }
        SellerViewModel model = new SellerViewModel {
            Status = status
        };
        return Ok(model);
    }

    [HttpGet]
    [Route("/seller/logout")]
    public IActionResult Logout() {
        CookieOptions options = new CookieOptions {
            Expires = DateTime.Now.AddDays(-1)
        };
        Response.Cookies.Append("SellerID", "0", options);
        _accessor?.HttpContext?.Session.SetInt32("SellerID", 0);
        Status status = new Status {
            StatusCode = 1,
            Message = "Đăng xuất thành công!"
        };
        return Ok(status);
    }

    [HttpPost]
    [Route("/seller/confirm-shipping-order")]
    public IActionResult ShippingOrder(int orderID = 0, int userID = 0) {
        Status status;
        // Cập nhật đơn hàng về trạng thái đang vận chuyển
        if (_shippingOrderRepository.insertShippingOrder(1, orderID) && _orderResponsitory.confirmOrderAboutTransiting(orderID, userID)) {
            status = new Status
            {
                StatusCode = 1,
                Message = "Phiếu đã được tạo thành công!"
            };
        } else {
            status = new Status
            {
                StatusCode = 1,
                Message = "Phiếu đã được tạo thành công!"
            };
        }
        // Lấy đơn hàng giao vừa được thêm
        List<ShippingOrder> shippingOrder = _shippingOrderRepository.getShippingOrderByOrderID(orderID).ToList();
        _accessor?.HttpContext?.Session.SetInt32("CurrentShippingOrderID", shippingOrder[0].PK_iShippingOrderID);
        return Ok(status);
    }

    [HttpGet]
    [Route("/seller/delivery-note/{orderID?}")]
    public IActionResult DeliveryNote(int orderID = 0) {
        // Lấy Cookie trên trình duyệt
        var sellerID = Request.Cookies["SellerID"];
        if (sellerID != null) {
            _accessor?.HttpContext?.Session.SetInt32("SellerID", Convert.ToInt32(sellerID));
        } else {
            return Redirect("/seller/login");
        }
        // Lấy đơn hàng giao theo mã đơn hàng
        List<ShippingOrder> shippingOrder = _shippingOrderRepository.getShippingOrderByOrderID(orderID).ToList();
        _accessor?.HttpContext?.Session.SetInt32("CurrentShippingOrderID", shippingOrder[0].PK_iShippingOrderID);
        return View();
    }

    [HttpPost]
    [Route("/seller/delivery-api")]
    public IActionResult DeliveryNoteAPI() {
        var sessionShippingOrderID = _accessor?.HttpContext?.Session.GetInt32("CurrentShippingOrderID");
        var sessionSellerID = _accessor?.HttpContext?.Session.GetInt32("SellerID");
        IEnumerable<SellerInfo> sellerInfos = _sellerResponsitory.getSellerInfoBySellerID(Convert.ToInt32(sessionSellerID));
        List<ShippingOrder> shippingOrders = _shippingOrderRepository.getShippingOrderByID(Convert.ToInt32(sessionShippingOrderID)).ToList();
        IEnumerable<Order> ordersWaitDelivery = _orderResponsitory.getOrderWaitDeliveryByOrderID(shippingOrders[0].FK_iOrderID);
        IEnumerable<OrderDetail> orderDetailsWaitDelivery = _orderResponsitory.getOrderDetailWaitDeliveyByOrderID(shippingOrders[0].FK_iOrderID);
        IEnumerable<Address> deliveryAddresses = _checkoutResponsitory.getAddressAccountByOrderID(shippingOrders[0].FK_iOrderID);
        SellerViewModel model = new SellerViewModel {
            ShippingOrders = shippingOrders,
            SellerInfos = sellerInfos,
            OrdersWaitDelivery = ordersWaitDelivery,
            OrderDetailsWaitDelivery = orderDetailsWaitDelivery,
            DeliveryAddresses = deliveryAddresses
        };
        return Ok(model);
    }
}