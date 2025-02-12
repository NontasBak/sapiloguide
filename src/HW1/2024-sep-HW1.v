// File: HW1_Sept24_Ex3.v
module HW1_Sept24_Ex3 (
    output reg Y,
    input X, clk, rst_n
);

    reg current_state, next_state;
    parameter   S0 = 2'b00,
                S1 = 2'b01,
                S2 = 2'b10,
                S3 = 2'b11;

    always @(posedge clk or negedge rst_n)
        begin
            if (!rst_n)
                current_state <= S0;
            else
                current_state <= next_state;
        end

    always @(current_state, X)
        begin
            case (current_state)
                S0: next_state = (X ? S2 : S1);
                S1: next_state = (X ? S3 : S2);
                S2: next_state = (X ? S3 : S1);
                S3: next_state = (X ? S0 : S2);
                default: next_state = S0;
            endcase
        end

    always @ (current_state or X)
        begin
            case (current_state)
                S0: Y = (X ? 1'b0 : 1'b1);
                S1: Y = (X ? 1'b1 : 1'b0);
                S2: Y = (X ? 1'b1 : 1'b0);
                S3: Y = (X ? 1'b0 : 1'b1);
                default: Y = 1'b0;
            endcase
        end
endmodule

// ------------------------------------------------
// File: HW1_Sept24_Ex3_tb.v
// ------------------------------------------------
`include HW1_Sept24_Ex3.v
`timescale 1ns/1ps

module HW1_Sept24_Ex3_tb ();
    reg X, clk, rst_n;
    wire Y;

    HW1_Sept24_Ex3 DUT (
        .X(X),
        .clk(clk),
        .rst_n(rst_n),
        .Y(Y)
    );

    initial 
        begin
            // Initialize clk and reset
            clk = 0;
            rst_n = 1;

            // Reset
            #5 rst_n = 0;
            #10 rst_n = 1;
        end

    always
        begin
            #10 clk = ~clk;
        end

    initial
        begin
            $display("X | Y");

            // Test Cases
            // S0 --> S1 
            X = 0;
            #25 $display("%b | %b", X, Y); // Expected Y = 1

            // S1 --> S2 (X = 0, unchanged)
            #20 $display("%b | %b", X, Y); // Expected Y = 0

            // S2 --> S3
            #10 X = 1;
            #10 $display("%b | %b", X, Y); // Expected Y = 1

            // S3 --> S0 (X = 1, unchanged)
            #20 $display("%b | %b", X, Y); // Expected Y = 0

            // S0 --> S2
            #10 X = 1;
            #10 $display("%b | %b", X, Y); // Expected Y = 0

            // S2 --> S1
            #10 X = 0;
            #10 $display("%b | %b", X, Y); // Expected Y = 0

            // S1 --> S3
            #10 X = 1;
            #10 $display("%b | %b", X, Y); // Expected Y = 1

            // S3 --> S2
            #10 X = 0;
            #10 $display("%b | %b", X, Y); // Expected Y = 1
        end
endmodule