import React, { useEffect } from "react";

import { Select } from 'antd'

const { Option } = Select

const ProductUpdateForm = ({
    submitHandler,
    changeHandler,
    categoryChangeHandler,
    values,
    setValues,
    categories,
    subcategoryOptions,
    arrayOfSubcategories,
    setArrayOfSubs,
    selectedCategory }) => {
    // destructure
    const {
        title,
        description,
        price,
        category,
        subcategories,
        shipping,
        quantity,
        images,
        colors,
        brands,
        color,
        brand,
    } = values;

    useEffect(() => {
        console.log('subcategoryOptions', subcategoryOptions)
    }, [])

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={title}
                    onChange={changeHandler}
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={description}
                    onChange={changeHandler}
                />
            </div>

            <div className="form-group">
                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={price}
                    onChange={changeHandler}
                />
            </div>

            <div className="form-group">
                <label>Shipping</label>
                <select
                    value={shipping === 'Yes' ? 'Yes' : 'No'}
                    name="shipping"
                    className="form-control"
                    onChange={changeHandler}
                >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label>Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    value={quantity}
                    onChange={changeHandler}
                />
            </div>

            <div className="form-group">
                <label>Color</label>
                <select value={color} name="color" className="form-control" onChange={changeHandler}>
                    {colors.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Brand</label>
                <select value={brand} name="brand" className="form-control" onChange={changeHandler}>
                    {brands.map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Category</label>
                {/* {JSON.stringify(category)} */}
                <select
                    name="category"
                    className="form-control"
                    onChange={categoryChangeHandler}
                    value={selectedCategory ? selectedCategory : category._id}
                >
                    {categories.length > 0 &&
                        categories.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                </select>
            </div>

            <div>
                    <label>Subcategories</label>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={arrayOfSubcategories}
                        onChange={value => setArrayOfSubs(value)}>
                        {subcategoryOptions.length && subcategoryOptions.map(s => {
                            return (
                                <Option key={s._id} value={s._id}>{s.name}</Option>
                            )
                        })}
                    </Select>

                </div>

            {/* <div className="form-group">
                <label>Category</label>
                <select
                    name="category"
                    className="form-control"
                    // dohvatimo id i posaljemo u backend da bismo na osnovu njega dohvatili subkategorije
                    onChange={categoryChangeHandler}
                >
                    <option>Please select</option>
                    {categories.length > 0 &&
                        categories.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                </select>
            </div> */}

            {/* {
                showSubcategories && <div>
                    <label>Subcategories</label>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={subcategories}
                        onChange={value => setValues({ ...values, subcategories: value })}>
                        {subcategoryOptions.length && subcategoryOptions.map(s => {
                            return (
                                <Option key={s._id} value={s._id}>{s.name}</Option>
                            )
                        })}
                    </Select>

                </div>
            } */}
            <br />
            <button className="btn btn-outline-info">Save</button>
        </form>
    );
};

export default ProductUpdateForm;
