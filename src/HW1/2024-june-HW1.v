// File: mux8to1.v
module mux8to1(
    input [7:0] inp,
    input [2:0] sel,
    output reg out
);
    always @(sel, inp) 
    begin
        case (sel)
            3'b000: out = inp[0];
            3'b001: out = inp[1];
            3'b010: out = inp[2];
            3'b011: out = inp[3];
            3'b100: out = inp[4];
            3'b101: out = inp[5];
            3'b110: out = inp[6];
            3'b111: out = inp[7];
            default: out = 1'b0;
        endcase
    end
endmodule

// ------------------------------------------------
// File: HW1_June24_Ex2.v
// ------------------------------------------------
`include mux8to1.v

module HW1_June24_Ex2(
    input [14:0] inp, 
    input [3:0] sel,
    output out
);
    wire out1, out2;
    
    mux8to1 MUX1 (.inp(inp[7:0]), .sel(sel[2:0]), .out(out1));
    mux8to1 MUX2 (.inp({1'b0, inp[14:8]}), .sel(sel[2:0]), .out(out2));
    
    wire not_sel3, and1, and2;
    not G1 (not_sel3, sel[3]);
    and G2 (and1, out1, not_sel3);
    and G3 (and2, out2, sel[3]);
    or  G4 (out, and1, and2);
endmodule

// ------------------------------------------------
// File: HW1_June24_Ex2_tb.v
// ------------------------------------------------
`include HW1_June24_Ex3.v
`timescale 1ns/1ps

module HW1_June24_Ex2_tb ();
    reg [14:0] inp;
    reg [3:0] sel;
    wire out;
    
    HW1_June24_Ex2 DUT (.inp(inp), .sel(sel), .out(out));
    
    initial begin
        // Test vector
        inp = 15'b101010101010101;
        
        for (integer i = 0; i < 15; i = i + 1) begin
            sel = i;
            #10 $display("sel = %b, out = %b", sel, out);
        end
    end
endmodule

// ------------------------------------------------
// File: HW1_June24_Ex3.v
// ------------------------------------------------
module HW1_June24_Ex3 (
    input X, clk, rst_n,
    output reg Y
);

    parameter S0 = 3'b000, 
              S1 = 3'b001, 
              S2 = 3'b010, 
              S3 = 3'b011, 
              S4 = 3'b100, 
              S5 = 3'b101;

    reg [2:0] current_state, next_state;

    always @(posedge clk) begin
        if (!rst_n)
            current_state <= S0;
        else
            current_state <= next_state;
    end

    always @(current_state or X) begin
        case (current_state)
            S0: next_state = (X ? S1 : S0);
            S1: next_state = S2;
            S2: next_state = S3;
            S3: next_state = S4;
            S4: next_state = S5;
            S5: next_state = S0;
            default: next_state = S0;
        endcase
    end

    always @(current_state) begin
        case (current_state)
            S1, S2, S3: Y = 1;
            default:    Y = 0;
        endcase
    end
endmodule

// ------------------------------------------------
// File: HW1_June24_Ex3_tb.v
// ------------------------------------------------
`include HW1_June24_Ex3.v
`timescale 1ns/1ps

module HW1_June24_Ex3_tb ();
    reg clk, rst_n, X;
    wire Y;

    HW1_June24_Ex3 DUT (
        .X(X),
        .clk(clk),
        .rst_n(rst_n),
        .Y(Y)
    );
    
    initial 
        begin
            // Initialize clk and reset
            clk = 0;
            rst_n = 0;

            // Reset
            #5 rst_n = 0;
            #10 rst_n = 0;
        end

    always
        begin
            #10 clk = ~clk;
        end

    initial 
        begin
            X = 0;
            
            #25 X = 1;       // Trigger the FSM
            $display("Y: %b", Y);

            for (integer i = 0; i < 8; i = i + 1) begin
                #10 $display("Y: %b", Y);
            end
            // Expected output: 0 1 1 1 0 0 0 0

            #100 $finish;
        end

    always 
        begin
            #10 $display("Y: %b", Y);
        end

endmodule





