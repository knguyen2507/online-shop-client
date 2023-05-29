const Pagination = ({items, numItemsInOnePage}) => {
    const page = items.length === 0 ? 1 : 
        (
            items.length%numItemsInOnePage === 0 ? 
            items.length/numItemsInOnePage : 
            Math.floor(items.length/numItemsInOnePage) + 1
        )
    
    const ItemsPaging = [];
    for (let i = 1; i <= page; i++) {
        const li = [];
        for (let j = numItemsInOnePage*(i - 1); j < numItemsInOnePage*i; j++) {
            if (items[j]) li.push(items[j]);
        }
        ItemsPaging.push(li);
    }
    return {
        page, ItemsPaging
    }
};

export {
    Pagination
}