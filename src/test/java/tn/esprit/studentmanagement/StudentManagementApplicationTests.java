package tn.esprit.studentmanagement;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class StudentManagementApplicationTests {

    @Test void contextLoads() {}
    @Test void dummyTest1() { assertTrue(true); }
    @Test void dummyTest2() { assertEquals(1,1); }
    @Test void dummyTest3() { int sum = 2+3; assertEquals(5,sum);}
    @Test void dummyTest4() { int sum = 2+3; assertEquals(5,sum);}

}
