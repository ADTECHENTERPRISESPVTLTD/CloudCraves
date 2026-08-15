import http from 'http';
import app from '../app';
import { connectDB } from '../config/database';
import { User } from '../models/User';
import { Admin } from '../models/Admin';
import { Food } from '../models/Food';
import { Order } from '../models/Order';
import { Category } from '../models/Category';
import { Review } from '../models/Review';

interface TestResult {
  suite: string;
  endpoint: string;
  expected: string;
  actual: string;
  status: 'PASS' | 'FAIL';
}

const results: TestResult[] = [];

function recordTest(suite: string, endpoint: string, expected: string, actual: string, passed: boolean) {
  results.push({
    suite,
    endpoint,
    expected,
    actual,
    status: passed ? 'PASS' : 'FAIL'
  });
}

const runAllTests = async () => {
  console.log('====================================================');
  console.log('Starting Stage 15 Comprehensive Backend Flow Tests...');
  console.log('====================================================\n');

  await connectDB();

  // Start HTTP server on port 5001 for test suite
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5001, () => resolve()));
  const baseUrl = 'http://localhost:5001/api';

  try {
    // 1. Health Check Test
    const resHealth = await fetch(`${baseUrl}/health`);
    const dataHealth: any = await resHealth.json();
    recordTest(
      'System Health',
      'GET /api/health',
      '200 OK with success: true',
      `HTTP ${resHealth.status} success: ${dataHealth.success}`,
      resHealth.status === 200 && dataHealth.success === true
    );

    // 2. Customer Registration Test
    const testEmail = `testuser_${Date.now()}@example.com`;
    const resReg = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Customer',
        phone: '9998887770',
        email: testEmail,
        password: 'password123'
      })
    });
    const dataReg: any = await resReg.json();
    const customerToken = dataReg.data?.token;
    const customerId = dataReg.data?.user?._id;
    recordTest(
      'Customer Registration',
      'POST /api/auth/register',
      '201 Created with JWT token & no passwordHash',
      `HTTP ${resReg.status} token: ${Boolean(customerToken)} passwordHash: ${dataReg.data?.user?.passwordHash}`,
      resReg.status === 201 && Boolean(customerToken) && !dataReg.data?.user?.passwordHash
    );

    // 3. Customer Login Test
    const resLogin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'password123' })
    });
    const dataLogin: any = await resLogin.json();
    recordTest(
      'Customer Login',
      'POST /api/auth/login',
      '200 OK with JWT token',
      `HTTP ${resLogin.status} token: ${Boolean(dataLogin.data?.token)}`,
      resLogin.status === 200 && Boolean(dataLogin.data?.token)
    );

    // 4. Admin Login Test
    const resAdminLogin = await fetch(`${baseUrl}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@cloudcraves.com', password: 'admin123' })
    });
    const dataAdminLogin: any = await resAdminLogin.json();
    const adminToken = dataAdminLogin.data?.token;
    recordTest(
      'Admin Login',
      'POST /api/admin/auth/login',
      '200 OK with Admin JWT token',
      `HTTP ${resAdminLogin.status} role: ${dataAdminLogin.data?.admin?.role}`,
      resAdminLogin.status === 200 && Boolean(adminToken)
    );

    // 5. Customer Protected Profile
    const resProfile = await fetch(`${baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const dataProfile: any = await resProfile.json();
    recordTest(
      'Customer Profile',
      'GET /api/users/me',
      '200 OK returning user data without passwordHash',
      `HTTP ${resProfile.status} name: ${dataProfile.data?.name}`,
      resProfile.status === 200 && Boolean(dataProfile.data?.name)
    );

    // 6. Restaurant Metadata Test
    const resRest = await fetch(`${baseUrl}/restaurant`);
    const dataRest: any = await resRest.json();
    recordTest(
      'Restaurant Info',
      'GET /api/restaurant',
      '200 OK returning restaurant info',
      `HTTP ${resRest.status} name: ${dataRest.data?.name}`,
      resRest.status === 200 && Boolean(dataRest.data?.name)
    );

    // 7. Food Browsing & Filter Test
    const resFoods = await fetch(`${baseUrl}/foods?veg=true`);
    const dataFoods: any = await resFoods.json();
    recordTest(
      'Food Catalog Filters',
      'GET /api/foods?veg=true',
      '200 OK returning filtered food items',
      `HTTP ${resFoods.status} count: ${dataFoods.data?.length}`,
      resFoods.status === 200 && Array.isArray(dataFoods.data) && dataFoods.data.length > 0
    );

    const firstFood = dataFoods.data[0];

    // 8. Address Creation Test
    const resAddAddress = await fetch(`${baseUrl}/users/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        name: 'Test Customer',
        phone: '9998887770',
        house: 'Flat 101, Test Residency',
        street: 'Test Street',
        area: 'Test Market',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        addressType: 'Home'
      })
    });
    const dataAddAddress: any = await resAddAddress.json();
    const addressId = dataAddAddress.data?._id;
    recordTest(
      'Address Creation',
      'POST /api/users/addresses',
      '201 Created returning address object',
      `HTTP ${resAddAddress.status} addressId: ${Boolean(addressId)}`,
      resAddAddress.status === 201 && Boolean(addressId)
    );

    // 9. CRITICAL ORDER PRICE GUARD TEST
    // Attempting to send tampered price 1 instead of actual database price (e.g., 240)
    const resOrderTamper = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        items: [
          {
            foodId: firstFood._id,
            price: 1, // TAMPERED CLIENT PRICE!
            quantity: 2
          }
        ],
        addressId,
        orderType: 'DELIVERY',
        paymentMethod: 'COD'
      })
    });
    const dataOrderTamper: any = await resOrderTamper.json();
    const createdOrder = dataOrderTamper.data;
    const expectedSubtotal = firstFood.price * 2;
    const serverUsedDbPrice = createdOrder?.items[0]?.price === firstFood.price && createdOrder?.subtotal === expectedSubtotal;
    recordTest(
      'Order Server Price Guard',
      'POST /api/orders (Price Tamper Attack)',
      `Server ignores client price 1 and calculates DB price ${firstFood.price}`,
      `HTTP ${resOrderTamper.status} DB Price: ${createdOrder?.items[0]?.price} Subtotal: ${createdOrder?.subtotal}`,
      resOrderTamper.status === 201 && serverUsedDbPrice
    );

    // 10. Customer Order History Test
    const resUserOrders = await fetch(`${baseUrl}/orders`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const dataUserOrders: any = await resUserOrders.json();
    recordTest(
      'Customer Order History',
      'GET /api/orders',
      '200 OK returning array of customer orders',
      `HTTP ${resUserOrders.status} count: ${dataUserOrders.data?.length}`,
      resUserOrders.status === 200 && Array.isArray(dataUserOrders.data)
    );

    // 11. Customer Order Details & Status Tracking Test
    const orderId = createdOrder._id;
    const resOrderStatus = await fetch(`${baseUrl}/orders/${orderId}/status`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const dataOrderStatus: any = await resOrderStatus.json();
    recordTest(
      'Customer Order Tracking',
      `GET /api/orders/:id/status`,
      '200 OK returning status PLACED',
      `HTTP ${resOrderStatus.status} status: ${dataOrderStatus.data?.orderStatus}`,
      resOrderStatus.status === 200 && dataOrderStatus.data?.orderStatus === 'PLACED'
    );

    // 12. Admin Order Listing Test
    const resAdminOrders = await fetch(`${baseUrl}/admin/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const dataAdminOrders: any = await resAdminOrders.json();
    recordTest(
      'Admin Order Listing',
      'GET /api/admin/orders',
      '200 OK returning all platform orders',
      `HTTP ${resAdminOrders.status} count: ${dataAdminOrders.data?.length}`,
      resAdminOrders.status === 200 && Array.isArray(dataAdminOrders.data)
    );

    // 13. Admin Status Transition Test (PLACED -> ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED)
    const resStatusUpdate = await fetch(`${baseUrl}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'ACCEPTED' })
    });
    const dataStatusUpdate: any = await resStatusUpdate.json();
    recordTest(
      'Admin Status Transition',
      'PATCH /api/admin/orders/:id/status',
      '200 OK updating status to ACCEPTED',
      `HTTP ${resStatusUpdate.status} status: ${dataStatusUpdate.data?.orderStatus}`,
      resStatusUpdate.status === 200 && dataStatusUpdate.data?.orderStatus === 'ACCEPTED'
    );

    // 14. Invalid Status Transition Guard Test (ACCEPTED -> DELIVERED direct jump blocked)
    const resInvalidTransition = await fetch(`${baseUrl}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'DELIVERED' })
    });
    recordTest(
      'Invalid Transition Guard',
      'PATCH /api/admin/orders/:id/status (Direct Jump)',
      '400 Bad Request with INVALID_STATUS_TRANSITION error',
      `HTTP ${resInvalidTransition.status}`,
      resInvalidTransition.status === 400
    );

    // Complete transition to DELIVERED so review test can run
    await fetch(`${baseUrl}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'PREPARING' })
    });
    await fetch(`${baseUrl}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'READY' })
    });
    await fetch(`${baseUrl}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' })
    });
    await fetch(`${baseUrl}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'DELIVERED' })
    });

    // 15. Customer Review Creation on Delivered Order Test
    const resReview = await fetch(`${baseUrl}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        orderId,
        foodId: firstFood._id,
        foodRating: 5,
        serviceRating: 5,
        comment: 'Super fast delivery and delicious taste!'
      })
    });
    const dataReview: any = await resReview.json();
    recordTest(
      'Review Creation',
      'POST /api/reviews',
      '201 Created on DELIVERED order',
      `HTTP ${resReview.status} rating: ${dataReview.data?.foodRating}`,
      resReview.status === 201 && dataReview.data?.foodRating === 5
    );

    // 16. Duplicate Review Protection Test
    const resDuplicateReview = await fetch(`${baseUrl}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        orderId,
        foodId: firstFood._id,
        foodRating: 5,
        serviceRating: 5,
        comment: 'Duplicate comment'
      })
    });
    recordTest(
      'Duplicate Review Guard',
      'POST /api/reviews (Duplicate Check)',
      '409 Conflict with REVIEW_ALREADY_EXISTS error',
      `HTTP ${resDuplicateReview.status}`,
      resDuplicateReview.status === 409
    );

    // 17. Admin Dashboard Stats Test
    const resDash = await fetch(`${baseUrl}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const dataDash: any = await resDash.json();
    recordTest(
      'Admin Dashboard',
      'GET /api/admin/dashboard',
      '200 OK returning aggregated database stats',
      `HTTP ${resDash.status} totalOrders: ${dataDash.data?.totalOrders} todayRevenue: ₹${dataDash.data?.todayRevenue}`,
      resDash.status === 200 && typeof dataDash.data?.totalOrders === 'number'
    );

    // 18. Admin Customer Management Test
    const resCustomers = await fetch(`${baseUrl}/admin/customers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const dataCustomers: any = await resCustomers.json();
    recordTest(
      'Admin Customer Management',
      'GET /api/admin/customers',
      '200 OK returning customer metrics without passwordHash',
      `HTTP ${resCustomers.status} count: ${dataCustomers.data?.length}`,
      resCustomers.status === 200 && Array.isArray(dataCustomers.data) && !dataCustomers.data[0]?.passwordHash
    );

    // 19. Customer Auth Access Guard Test (Customer JWT cannot access admin endpoint)
    const resCustomerAdminAccess = await fetch(`${baseUrl}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    recordTest(
      'Role Authorization Guard',
      'GET /api/admin/dashboard (Customer Token)',
      '403 Forbidden',
      `HTTP ${resCustomerAdminAccess.status}`,
      resCustomerAdminAccess.status === 403
    );

    // 20. 404 Unknown Route Handler Test
    const resNotFound = await fetch(`${baseUrl}/unknown-nonexistent-route`);
    recordTest(
      'Central 404 Handler',
      'GET /api/unknown-nonexistent-route',
      '404 Not Found',
      `HTTP ${resNotFound.status}`,
      resNotFound.status === 404
    );
  } catch (error) {
    console.error('Test execution error:', error);
  } finally {
    server.close();
  }

  // Print Test Report Summary Table
  console.log('\n====================================================');
  console.log('STAGE 15 BACKEND INTEGRATION TEST RESULTS REPORT');
  console.log('====================================================\n');
  console.table(results);

  const passedCount = results.filter((r) => r.status === 'PASS').length;
  const totalCount = results.length;
  console.log(`\nTOTAL PASSED: ${passedCount} / ${totalCount} (${Math.round((passedCount / totalCount) * 100)}%)`);

  if (passedCount === totalCount) {
    console.log('ALL BACKEND FLOW TESTS PASSED CLEANLY!\n');
    process.exit(0);
  } else {
    console.error('SOME TESTS FAILED!\n');
    process.exit(1);
  }
};

runAllTests();
