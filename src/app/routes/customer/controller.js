import request from 'request-promise-native';
import '../../helpers/array-helper.js';
export const getAll = async(req, res) => {
    let customers = await request({uri: "http://www.mocky.io/v2/598b16291100004705515ec5",  json: true});
    let orders = await request({uri: "http://www.mocky.io/v2/598b16861100004905515ec7",  json: true});
    customers = customers.map(customer =>{
        const customerOrders = orders.filter(order => order.cliente.substring(1) == customer.cpf.replace("-", "."));
        customer.sum = customerOrders.reduce((sum, order)=> {return sum + order.valorTotal}, 0);
        customer.sum = customer.sum.toFixed(2);
        return customer;
    });
    customers = customers.sort(function(a,b){
        if (a.sum > b.sum) {
            return -1;
        }
        if (a.sum < b.sum) {
            return 1;
        }
        return 0;
    });
    return res.json(customers);
};

export const getWithHighestOrder = async(req, res) => {
    let customers = await request({uri: "http://www.mocky.io/v2/598b16291100004705515ec5",  json: true});
    let orders = await request({uri: "http://www.mocky.io/v2/598b16861100004905515ec7",  json: true});
    let ordersFrom2016 = orders.filter(order => {
        let values = order.data.split("-");
        let year = new Date(`${values[1]}-${values[0]}-${values[2]}`).getFullYear();
        return year == 2016;
    });
    ordersFrom2016 = ordersFrom2016.sort(function(a,b){
        if (a.valorTotal > b.valorTotal) {
            return -1;
        }
        if (a.sum < b.sum) {
            return 1;
        }
        return 0;
    });
    const customer = customers.filter(customer => ordersFrom2016[0].cliente.substring(1) == customer.cpf.replace("-", "."))
    return res.json(customer);
};

export const mostLoyal = async(req, res) => {
    let customers = await request({uri: "http://www.mocky.io/v2/598b16291100004705515ec5",  json: true});
    let orders = await request({uri: "http://www.mocky.io/v2/598b16861100004905515ec7",  json: true});
    customers = customers.map(customer =>{
        customer.orders = orders.filter(order => order.cliente.substring(1) == customer.cpf.replace("-", "."));
        return customer;
    });
    customers = customers.sort(function(a,b){
        if (a.orders.length > b.orders.length) {
            return -1;
        }
        if (a.orders.length < b.orders.length) {
            return 1;
        }
        return 0;
    });
    customers.forEach(customer => delete customer.orders);
    return res.json(customers.slice(0, 3));

}

export const suggestWine = async(req, res) => {
    const { cpf } = req.body;
    if(cpf != undefined && (cpf).match(/\d{3}\.\d{3}\.\d{3}-\d{2}/, "i")){
        const orders = await request({uri: "http://www.mocky.io/v2/598b16861100004905515ec7",  json: true})
        let itens = orders.$flatMap(order => order.itens);
        let customerCategories = orders
                                    .filter(order => order.cliente.substring(1) == cpf.replace("-", "."))
                                    .$flatMap(order => order.itens)
                                    .map(item => item.categoria);                
        let repeatedCategory = {};
        customerCategories.forEach(category =>{
            if(repeatedCategory[category] == undefined){
                repeatedCategory[category] = 1;
            }else{
                repeatedCategory[category] += 1;
            }
        });
        let mostRepeated = {category:"",total: 0};
        for(let category in repeatedCategory){
            if(repeatedCategory[category] > mostRepeated.total){
                mostRepeated.category = category;
                mostRepeated.total = repeatedCategory[category];
            }
        }
        let itensFromCategory = itens.filter(item => item.categoria == mostRepeated.category)
        let suggestion = itensFromCategory[Math.round(Math.random() * (itensFromCategory.length)) ];
        res.json(suggestion);
    }else
       return res.boom.badRequest("CPF is required and should follow this format xxx.xxx.xxx-xx");
}