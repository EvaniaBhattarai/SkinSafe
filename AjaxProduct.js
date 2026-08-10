"use strict";

const AjaxProduct = (url) => {

    const [isLoading, setIsLoading] = React.useState(true);
    const [dbList, setDbList] = React.useState([]);
    const [filteredList, setFilteredList] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [filterInput, setFilterInput] = React.useState("");

    React.useEffect(() => {
        ajax_alt(
            url || "product/getAll",
            function (obj) {
                if (obj.dbError.length > 0) {
                    setError(obj.dbError);
                } else {
                    let sortedList = [...obj.productList];
                    jsSort(sortedList, "product_id", "number");
                    setDbList(sortedList);
                    setFilteredList(sortedList);
                }
                setIsLoading(false);
            },
            function (msg) {
                setError(msg);
                setIsLoading(false);
            }
        );
    }, []);

    function callInsert() {
        window.location.hash = "#/productInsert";
    }

    function sortByProp(propName, sortType) {
        jsSort(filteredList, propName, sortType);
        setFilteredList(JSON.parse(JSON.stringify(filteredList)));
    }

    const doFilter = (val) => {
        const searchVal = (val || "").toLowerCase();
        const newList = dbList.filter(item => {
            return (
                (item.name || "").toLowerCase().includes(searchVal) ||
                (item.manufacturer || "").toLowerCase().includes(searchVal) ||
                (item.category || "").toLowerCase().includes(searchVal) ||
                (item.user_email || "").toLowerCase().includes(searchVal)
            );
        });
        setFilteredList(newList);
    };

    const clearFilter = () => {
        setFilterInput("");
        setFilteredList(dbList);
    };

    function deleteProduct(productId) {
        modalFw.confirm("Are you sure you want to delete this product?", function () {
            ajax_alt(
                "product/delete?productId=" + productId,
                function (obj) {
                    if (obj.errorMsg && obj.errorMsg.length > 0) {
                        modalFw.alert("Could not delete product: " + obj.errorMsg);
                    } else {
                        setDbList(function (prevList) {
                            return prevList.filter(function (p) {
                                return p.product_id !== productId;
                            });
                        });
                        setFilteredList(function (prevList) {
                            return prevList.filter(function (p) {
                                return p.product_id !== productId;
                            });
                        });
                        modalFw.snackBar("Product successfully deleted.", 3000);
                    }
                },
                function (msg) {
                    modalFw.alert("Network error while trying to delete: " + msg);
                }
            );
        });
    }

    if (isLoading) return <div>Loading Product Data...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="clickSort">
            <h3>
                Product List &nbsp;
                <button onClick={callInsert} title="Add new product"
                    style={{
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        border: "none",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        lineHeight: "1",
                        verticalAlign: "middle"
                    }}>
                    +
                </button>
            </h3>
            <h4>
                Filter: &nbsp;
                <input
                    value={filterInput}
                    onChange={(e) => setFilterInput(e.target.value)}
                />
                &nbsp;<button onClick={() => doFilter(filterInput)}>Search</button>
                &nbsp;<button onClick={clearFilter}>Clear</button>
            </h4>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th onClick={() => sortByProp("product_id", "number")}>
                            <img src="icons/dark/blackDownSort.png" /> ID
                        </th>
                        <th onClick={() => sortByProp("name", "text")}>
                            <img src="icons/dark/blackDownSort.png" /> Name / Manufacturer / Image
                        </th>
                        <th onClick={() => sortByProp("category", "text")}>
                            <img src="icons/dark/blackDownSort.png" /> Category
                        </th>
                        <th onClick={() => sortByProp("price", "number")} className="textAlignRight">
                            <img src="icons/dark/blackDownSort.png" /> Price
                        </th>
                        <th onClick={() => sortByProp("rating", "number")} className="textAlignRight">
                            <img src="icons/dark/blackDownSort.png" /> Rating
                        </th>
                        <th onClick={() => sortByProp("user_email", "text")}>
                            <img src="icons/dark/blackDownSort.png" /> Added By
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList.map(item => (
                        <tr key={item.product_id}>
                            <td className="textAlignCenter">
                                <img
                                    src="icons/delete_icon.png"
                                    alt="Delete"
                                    title="Delete this product"
                                    style={{ width: "20px", cursor: "pointer" }}
                                    onClick={() => deleteProduct(item.product_id)}
                                />
                            </td>
                            <td>
                                <a href={"#/productUpdate/" + item.product_id}>
                                    <img src="icons/dark/editicon.png" title="Edit this product"
                                        style={{ width: "20px", cursor: "pointer" }} />
                                </a>
                            </td>
                            <td>{item.product_id}</td>
                            <td className="shadowImage textAlignCenter">
                                {item.name} <br />
                                {item.manufacturer} <br />
                                <img src={item.product_img} style={{ maxWidth: "60px" }} />
                            </td>
                            <td>{item.category}</td>
                            <td className="textAlignRight">
                                {item.price.length > 0 ? item.price : "N/A"}
                            </td>
                            <td className="textAlignRight">
                                {item.rating.length > 0 ? item.rating : "N/A"}
                            </td>
                            <td className="shadowImage textAlignCenter">
                                {item.user_email} <br />
                                <img src={item.user_image} style={{ maxWidth: "60px" }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};